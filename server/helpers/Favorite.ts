import { db } from '../db';
import { favorites, movies } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { Favorite as FavoriteType, Movie as MovieType } from '../types';

export class Favorite {
	static async create(favoriteData: {
		userId: number;
		movieId: number;
	}): Promise<FavoriteType> {
		const existingFavorite = await db
			.select()
			.from(favorites)
			.where(
				and(
					eq(favorites.userId, favoriteData.userId),
					eq(favorites.movieId, favoriteData.movieId)
				)
			);

		if (existingFavorite.length > 0) {
			return existingFavorite[0] as unknown as FavoriteType;
		}

		const result = await db
			.insert(favorites)
			.values({
				userId: favoriteData.userId,
				movieId: favoriteData.movieId,
			})
			.returning();

		return result[0] as unknown as FavoriteType;
	}

	static async findByUserIdAndMovieId(
		userId: number,
		movieId: number
	): Promise<FavoriteType | undefined> {
		const result = await db
			.select()
			.from(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)));

		return result[0] as unknown as FavoriteType;
	}

	static async delete(userId: number, movieId: number): Promise<void> {
		await db
			.delete(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)));
	}

	static async getFavoriteMoviesByUserId(userId: number): Promise<MovieType[]> {
		const result = await db
			.select({
				movie: movies,
			})
			.from(favorites)
			.innerJoin(movies, eq(favorites.movieId, movies.id))
			.where(eq(favorites.userId, userId));

		return result.map((r) => r.movie) as unknown as MovieType[];
	}

	static async isFavorite(userId: number, movieId: number): Promise<boolean> {
		const favorite = await this.findByUserIdAndMovieId(userId, movieId);
		return !!favorite;
	}
}
