import axios from 'axios';

export async function queryCollectionPoolList(parameter) {
  return axios({ 
    url: 'https://testapi.ezswap.io/api/queryCollectionPoolList',
    method: 'post',
    data: parameter,
  });
}