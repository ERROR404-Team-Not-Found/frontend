const BASE_URL = "https://model.sedimark.work"
const BLOCKCHAIN_SEVICE_BASE_URL = "https://apis.sedimark.work/transactions/"
const TRAIN_BASE_URL = "https://model.sedimark.work"

export const GET_MODELS = (user_id) => `${BASE_URL}/models?user_id=${user_id}`
export const GET_ARCHITECTURE = (user_id, model_name) => `${BASE_URL}/model/architecture?user_id=${user_id}&model_name=${model_name}`
export const GET_DATASET = (user_id, model_name) => `${BASE_URL}/model/dataset?user_id=${user_id}&model_name=${model_name}`
export const GET_VERSIONS = (user_id, model_name) => `${BASE_URL}/model/versions?user_id=${user_id}&model_name=${model_name}`
export const DOWNLOAD_WEIGHTS = (user_id, model_name, version, hash) => `${BASE_URL}/model/weight?user_id=${user_id}&model_name=${model_name}&version=${version}&hash=${hash}`
export const TRAIN = `${TRAIN_BASE_URL}/model/train`
export const STATUS = (user_id) => `${TRAIN_BASE_URL}/train/status?user_id=${user_id}`
export const VERSION = (user_id, model_name) => `${TRAIN_BASE_URL}/model/version/last?user_id=${user_id}&model_name=${model_name}`

export const GET_TRANSACTIONS = (user_address) => `${BLOCKCHAIN_SEVICE_BASE_URL}${user_address}`


export const GET_ACTIVATION = `${BASE_URL}/model/activations`;
export const GET_LAYERS = `${BASE_URL}/model/layers`;
