import ApiBase from "./api-base.ts";
import FetchAdapter from "./adapters/fetch-adapter.ts";

export const Api = new ApiBase("http://localhost:3000", new FetchAdapter());
