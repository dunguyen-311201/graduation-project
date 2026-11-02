import {Route} from '@constants';
import {callAPI} from '@services';

export const rejectAssign = async (id: string) => {
  await callAPI({method: 'POST', route: `${Route.ASSIGNMENTS}/${id}/reject`});
};
