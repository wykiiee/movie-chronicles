import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import AsyncHandler from '../middleware/asyncHandler';
import { BadRequestError } from '../utils/errors';
import crypto from 'crypto';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { EmailService } from '../services/EmailService';

export class AuthController {
	static register = AsyncHandler(async (req: Request, res: Response) => {
		const { name, username, email, password } = req.body;

		if (!name || !username || !email || !password) {
			res
				.status(400)
				.json({ error: 'Username, email, and password are required' });
			return;
		}

		// Get IP address from request
		const ipAddress =
			req.ip || (req.headers['x-forwarded-for'] as string) || '';

		const authPayload = await AuthService.register(
			name,
			username,
			email,
			password,
			ipAddress
		);

		// Set access token cookie
		res.cookie('accessToken', authPayload.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		// Set refresh token cookie
		if (authPayload.refreshToken) {
			res.cookie('refreshToken', authPayload.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});
		}

		res.status(201).json({
			message: 'User registered successfully',
			data: {
				user: {
					id: authPayload.user.id,
					name: authPayload.user.name,
					username: authPayload.user.username,
					email: authPayload.user.email,
					avatar: authPayload.user.avatar,
					createdAt: authPayload.user.createdAt,
				},
			},
		});
	});

	static login = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { username, email, password } = req.body;

			const loginIdentifier = username || email;

			if (!loginIdentifier || !password) {
				throw new BadRequestError('Invalid Credentials ');
			}

			// Get IP address and device info from request
			const ipAddress =
				req.ip || (req.headers['x-forwarded-for'] as string) || '';
			const userAgent = req.headers['user-agent'] || '';

			const authPayload = await AuthService.login(
				loginIdentifier,
				password,
				ipAddress,
				userAgent
			);

			// Set access token cookie
			res.cookie('accessToken', authPayload.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			// Set refresh token cookie
			if (authPayload.refreshToken) {
				res.cookie('refreshToken', authPayload.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				});
			}

			res.status(200).json({
				message: 'Login successful',
				data: {
					user: {
						id: authPayload.user.id,
						username: authPayload.user.username,
						email: authPayload.user.email,
						avatar: authPayload.user.avatar,
						createdAt: authPayload.user.createdAt,
					},
				},
			});
		}
	);

	static getCurrentUser = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Not authenticated' });
				return;
			}

			res.status(200).json({
				message: 'User profile retrieved successfully',
				data: {
					user: {
						id: req.user.id,
						username: req.user.username,
						email: req.user.email,
						avatar: req.user.avatar,
						createdAt: req.user.createdAt,
					},
				},
			});
		}
	);

	static refreshToken = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const refreshToken = req.cookies.refreshToken;

			if (!refreshToken) {
				res.status(400).json({ error: 'Refresh token is required' });
				return;
			}

			const { accessToken } = await AuthService.refreshAccessToken(
				refreshToken
			);

			// Set new access token cookie
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			res.status(200).json({
				message: 'Token refreshed successfully',
			});
		}
	);

	static verifyEmail = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { token } = req.query;

			if (!token || typeof token !== 'string') {
				res.status(400).json({ error: 'Verification token is required' });
				return;
			}

			await AuthService.verifyEmail(token);

			res.status(200).json({
				message: 'Email verified successfully',
			});
		}
	);

	static requestPasswordReset = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { email } = req.body;

			if (!email) {
				res.status(400).json({ error: 'Email is required' });
				return;
			}

			await AuthService.requestPasswordReset(email);

			res.status(200).json({
				message: 'Password reset email sent if the email exists in our system',
			});
		}
	);

	static resetPassword = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { token, newPassword } = req.body;

			if (!token || !newPassword) {
				res.status(400).json({ error: 'Token and new password are required' });
				return;
			}

			await AuthService.resetPassword(token, newPassword);

			res.status(200).json({
				message: 'Password reset successful',
			});
		}
	);

	static updateEmail = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Not authenticated' });
				return;
			}

			const { newEmail } = req.body;

			if (!newEmail) {
				res.status(400).json({ error: 'New email is required' });
				return;
			}

			await AuthService.updateEmail(req.user.id, newEmail);

			res.status(200).json({
				message:
					'Email update initiated. Please verify your new email address.',
			});
		}
	);

	static resendVerificationEmail = AsyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (!req.user) {
				res.status(401).json({ error: 'Not authenticated' });
				return;
			}

			// Generate new verification token
			const emailVerificationToken = crypto.randomBytes(32).toString('hex');
			const emailVerificationExpires = new Date(
				Date.now() + 24 * 60 * 60 * 1000
			).toISOString();

			// Update user with new token
			await db
				.update(users)
				.set({
					emailVerificationToken,
					emailVerificationExpires,
				})
				.where(eq(users.id, req.user.id));

			// Send verification email
			await EmailService.sendVerificationEmail(
				req.user,
				emailVerificationToken
			);

			res.status(200).json({
				message: 'Verification email sent successfully',
			});
		}
	);
}
