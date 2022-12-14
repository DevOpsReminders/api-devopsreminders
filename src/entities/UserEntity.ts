import { Entity, Column, Index } from 'typeorm';
import AppBaseEntity from '@database/core/AppBaseEntity';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import jwt from 'jsonwebtoken';
import appConfig from '@config/index';
import { omit } from 'lodash';

type AuthPayload = {
    user: Omit<UserEntity, 'password' | 'deleted'>;
    jwt: string;
};

@Entity()
export class UserEntity extends AppBaseEntity {
    @Column('varchar')
    name!: string;

    @Column('varchar')
    @Index('userEmail', { unique: true })
    email!: string;

    @Column('boolean', { nullable: false, default: false })
    emailConfirmed!: boolean;

    @Column('varchar', { nullable: true, default: null })
    @Exclude()
    password!: string;

    @Column('varchar', { default: null, nullable: true })
    avatar?: string;

    encryptPassword() {
        this.password = bcrypt.hashSync(this.password, 4);
    }

    toAuthPayload(): AuthPayload {
        const token = jwt.sign(
            {
                id: this.id,
                name: this.name,
            },
            appConfig.auth.jwtSecret,
            {
                issuer: appConfig.server.hostname,
                expiresIn: '24 hours',
            },
        );

        return {
            user: omit(this, ['password', 'deleted']),
            jwt: token,
        };
    }
}
