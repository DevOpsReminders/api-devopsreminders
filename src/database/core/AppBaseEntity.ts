import {
    BaseEntity,
    CreateDateColumn,
    DeepPartial,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Exclude } from 'class-transformer';

export type FindPaginatedParams<T> = {
    limit: number;
    page: number;
} & FindManyOptions<T>;

export type Pagination = {
    limit: number;
    totalItems: number;
    page: number;
    totalPages: number;
};

export type PaginatedItems<T> = {
    pagination: Pagination;
    items: T[];
};

export default class AppBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted!: Date;

    static saveFromPartial<T extends BaseEntity>(
        this: {
            new (): T;
        } & typeof BaseEntity,
        data: Partial<T>,
    ): Promise<T> {
        const entity = this.create(data as DeepPartial<T>);
        return entity.save() as Promise<T>;
    }

    static async findPaginated<T extends BaseEntity>(
        this: {
            new (): T;
        } & typeof BaseEntity,
        params: Partial<FindPaginatedParams<T>>,
    ): Promise<PaginatedItems<T>> {
        const findParams: FindPaginatedParams<T> = {
            ...{
                page: 1,
                limit: 10,
            },
            ...params,
        };

        const { page, limit, ...rest } = findParams;
        const options: FindManyOptions<T> = {
            ...rest,
            skip: (page - 1) * limit,
            take: limit,
        };
        const [items, totalItems] = await this.findAndCount<T>(options);

        return {
            pagination: {
                limit,
                totalItems,
                page,
                totalPages: Math.ceil(totalItems / limit),
            },
            items,
        };
    }
}
