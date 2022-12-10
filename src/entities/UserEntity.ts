import { Entity, Column } from 'typeorm';
import AppBaseEntity from '@database/core/AppBaseEntity';

@Entity()
export class UserEntity extends AppBaseEntity {
    @Column('varchar')
    name!: string;

    @Column('varchar')
    email!: string;

    @Column('varchar')
    avatar!: string;
}
