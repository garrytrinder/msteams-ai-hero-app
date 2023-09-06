import { Application } from '@microsoft/teams-ai';
import { ApplicationTurnState } from '../app';
import * as userME from './userME';

const setup = (app: Application<ApplicationTurnState>) => {

    app.messageExtensions.query("userQuery", userME.query);
    
};

export { setup };
