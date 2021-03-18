import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
// this class provides the data structure for data cached from HTTP requests
// and methods to update the cache
export class HttpCacheService {
  private requests: any = {};
  constructor() {}

  // add new item to cache
  put(url: string, response: HttpResponse<any>): void {
    this.requests[url] = response;
  }

  // if doesn't exist in cache, undefined is returned
  get(url: string): HttpResponse<any> | undefined {
    return this.requests[url];
  }

  // invalidating cache forces getting a fresh copy from the server; typically do this on posts/deletes/puts

  // invalides only a specific url in the cache
  invalidateUrl(url: string): void {
    this.requests[url] = undefined;
  }

  // invalid entire cache
  invalidateCache(): void {
    this.requests = {};
  }
}
