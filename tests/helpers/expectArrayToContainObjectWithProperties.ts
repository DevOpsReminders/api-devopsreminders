import chai from 'chai';
import chai_like from 'chai-like';
import chai_things from 'chai-things';

chai.use(chai_like);
chai.use(chai_things);
const { expect } = chai;

export const expectArrayToContainObjectWithProperties = <T>(arr: T[], obj: T): void => {
    expect(arr).to.be.an('array').that.contains.something.like(obj);
};
