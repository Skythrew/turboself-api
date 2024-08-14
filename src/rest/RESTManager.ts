/** @module RESTManager */
import { request } from "undici";
import { RequestOptions } from "../types/request-handler";

export class RestManager {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async sendRequest<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, headers } = options;
    const url = `${this.baseURL}/${path}`;
    const response = await request(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        "User-Agent": "@raphckrman/turboself-api"
      }
    });

    const responseData = await response.body.json();
    if (!response.statusCode.toString().startsWith("2")) {
      throw new Error(`${response.statusCode}: ${JSON.stringify(responseData)}`);
    }

    return responseData as T;
  }

  async get<T>(
    path: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.sendRequest<T>({
      method: "GET",
      path: path,
      headers: headers
    });
  }

  async post<T>(
    path: string,
    body: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.sendRequest<T>({
      method: "POST",
      path,
      body,
      headers: options?.headers
    });
  }

  async put<T>(
    path: string,
    body: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.sendRequest<T>({
      method: "PUT",
      path,
      body,
      headers: options?.headers
    });
  }

  async delete<T>(
    path: string,
    params?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    const urlParams = new URLSearchParams(params).toString();
    const urlPath = urlParams ? `${path}?${urlParams}` : path;
    return this.sendRequest<T>({
      method: "DELETE",
      path: urlPath,
      headers: options?.headers
    });
  }
}
