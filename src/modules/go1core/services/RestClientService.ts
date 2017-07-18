import "rxjs";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Response} from "@angular/http";
import {RequestMethod} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Headers} from "@angular/http";
import {RequestOptionsArgs} from "@angular/http";
import * as _ from 'lodash';


/**
 * Represent Centralize Ajax Service
 */

const applicationJsonType = 'application/json';

@Injectable()
export class RestClientService {
  connectionType = {
    connected: 2,
    notConnected: 3,
  };

  constructor(private httpService: Http) {
  }

  rawRequest<T>(url: string, type: RequestMethod, optionCallback?: Function): Observable<Response> {
    const options = <RequestOptionsArgs>{
      method: type,
      headers: new Headers({})
    };

    if (optionCallback) {
      optionCallback(options);
    }

    return this.httpService.request(url, options);
  }

  request<T>(url: string, type: RequestMethod, data?: any, customHeaders?: any) {
    let headers = {
      'Content-Type': applicationJsonType,
      'Accept': applicationJsonType
    };

    if (customHeaders) {
      headers = _.merge(headers, customHeaders);
    }

    const options = <RequestOptionsArgs>{
      method: type,
      headers: new Headers(headers)
    };

    if (data && headers['Content-Type'] === applicationJsonType) {
      options.body = JSON.stringify(data);
    }

    return this.httpService.request(url, options).map(this.mapResponse);
  }

  private mapResponse<T>(response: Response): T | any {
    try {
      return <T>response.json();
    } catch (e) {
      return <T>{};
      // return response;
    }
  }

  head<T>(url: string): Observable<T> {
    return this.request<T>(url, RequestMethod.Head);
  }

  get<T>(url: string, customHeaders?: any): Observable<T> {
    return this.request<T>(url, RequestMethod.Get, null, customHeaders);
  }

  getAsync(url: string, customHeaders?: any) {
    return this.request(url, RequestMethod.Get, null, customHeaders).toPromise();
  }

  post<T>(url: string, data?: any, customHeaders?: any): Observable<T> {
    return this.request<T>(url, RequestMethod.Post, data, customHeaders);
  }

  postAsync(url: string, data?: any, customHeaders?: any) {
    return this.request(url, RequestMethod.Post, data, customHeaders).toPromise();
  }

  put<T>(url: string, data?: any, customHeaders?: any): Observable<T> {
    return this.request<T>(url, RequestMethod.Put, data, customHeaders);
  }

  putAsync(url: string, data?: any, customHeaders?: any) {
    return this.request(url, RequestMethod.Put, data, customHeaders).toPromise();
  }

  delete<T>(url: string, customHeaders?: any): Observable<T> {
    return this.request<T>(url, RequestMethod.Delete, null, customHeaders);
  }

  deleteAsync(url: string, customHeaders?: any) {
    return this.request(url, RequestMethod.Delete, null, customHeaders).toPromise();
  }
}
