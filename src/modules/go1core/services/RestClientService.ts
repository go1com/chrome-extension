import "rxjs";
import {Injectable} from "@angular/core";
import * as _ from 'lodash';

const RequestMethod = {
  HEAD: 'HEAD',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

/**
 * Represent Centralize Ajax Service
 */

const applicationJsonType = 'application/json';

@Injectable()
export class RestClientService {
  getUrls: any[] = [];

  request<T>(url: string, type: string, data?: any, customHeaders?: any) {
    let headers = {
      'Content-Type': applicationJsonType,
      'Accept': applicationJsonType
    };

    if (customHeaders) {
      headers = _.merge(headers, customHeaders);
    }

    const options = <any>{
      method: type,
      headers: new Headers(headers)
    };

    if (data && headers['Content-Type'] === applicationJsonType) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        return response.json().then(response => {
          throw response;
        });
      })
      .then(response => {
        try {
          return JSON.parse(response);
        } catch (e) {
          return response;
        }
      });
  }

  head<T>(url: string) {
    return this.request<T>(url, RequestMethod.HEAD);
  }

  get <T>(url: string, customHeaders?: any) {
    return this.request<T>(url, RequestMethod.GET, null, customHeaders);
  }

  singleGet<T>(url: string, customHeaders?: any) {
    let existingRequest = this.getUrls.find(getRequest => getRequest.url === url);
    if (existingRequest) {
      return existingRequest.request;
    }

    const promise = this.request<T>(url, RequestMethod.GET, null, customHeaders).then(response => {
      setTimeout(() => {
        this.getUrls = _.filter(this.getUrls, getRequest => getRequest.url !== url);
      }, 700);

      return response;
    });

    this.getUrls.push({
      url: url,
      request: promise
    });

    return promise;
  }

  post<T>(url: string, data?: any, customHeaders?: any) {
    return this.request<T>(url, RequestMethod.POST, data, customHeaders);
  }

  put<T>(url: string, data?: any, customHeaders?: any) {
    return this.request<T>(url, RequestMethod.PUT, data, customHeaders);
  }

  delete<T>(url: string, customHeaders?: any) {
    return this.request<T>(url, RequestMethod.DELETE, null, customHeaders);
  }
}
