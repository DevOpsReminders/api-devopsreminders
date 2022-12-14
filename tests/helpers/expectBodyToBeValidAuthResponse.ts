import { expect } from 'chai';
import { isJWT } from 'class-validator';
import { UserEntity } from '@entities/UserEntity';

export const expectBodyToBeValidAuthResponse = (body: Record<string, unknown>, user: UserEntity) => {
    expect(body).to.not.have.property('errors');

    expect(body).to.have.property('user').and.deep.include({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    });

    expect(body)
        .to.have.property('jwt')
        .and.be.a('string')
        .and.satisfy((jwt: string) => isJWT(jwt));
};
