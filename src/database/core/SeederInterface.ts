import { EntityManager } from 'typeorm';

type SeederInterface = {
    entityManager: EntityManager;
    run: () => Promise<unknown>;
};
export default SeederInterface;
