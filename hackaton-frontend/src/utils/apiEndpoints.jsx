const BASE_URL = "https://3tl33zkm-8000.euw.devtunnels.ms"

export const GET_MODELS = (user_id) => `${BASE_URL}/models?user_id=${user_id}`
export const GET_ARCHITECTURE = (user_id, model_name) => `${BASE_URL}/model/architecture?user_id=${user_id}&model_name=${model_name}`
export const GET_DATASET = (user_id, model_name) => `${BASE_URL}/model/dataset?user_id=${user_id}&model_name=${model_name}`
export const GET_ACTIVATION = `${BASE_URL}/model/activations`;
export const GET_LAYERS = `${BASE_URL}/model/layers`;
