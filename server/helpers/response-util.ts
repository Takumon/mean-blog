
/**
 * 500エラー時のレスポンスを設定
 */
function sysError(res, errorResponse: { title: string; error: string; } ): void {
  res.status(500).json(errorResponse);
}

/**
 * 404エラー時のレスポンスを設定
 */
function notFoundError(res, errorResponse: { title: string; error?: string; } ): void {
  res.status(404).json(errorResponse);
}

/**
 * 403エラー時のレスポンスを設定
 */
function forbiddenError(res, errorResponse: { title: string; error?: string; } ): void {
  res.status(403).json(errorResponse);
}


/**
 * 入力チェックエラー時のレスポンスを設定
 */
function validationError(res, errors ): void {
  res.status(400).json({ errors });
}


/**
 * 登録(Create)、更新(Update)、削除時(delete) 成功時時のレスポンスを設定
 */
function cudSuccess<T>(res, responseModel: { message: string; obj: T; }): void {
  res.status(200).json(responseModel);
}

/**
 * 一件検索（Read） 成功時時のレスポンスを設定
 */
function singleReadSuccess<T>(res, responseModel: T): void {
  res.status(200).json(responseModel);
}


/**
 * 複数件検索（Read） 成功時時のレスポンスを設定
 */
function multiReadSuccess<T>(res, responseModels: T[]): void {
  res.status(200).json(responseModels);
}


export {
  sysError,
  notFoundError,
  forbiddenError,
  validationError,
  cudSuccess,
  multiReadSuccess,
  singleReadSuccess,
};
