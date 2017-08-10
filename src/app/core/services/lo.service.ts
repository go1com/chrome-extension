import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {UserService} from "../../../modules/membership/services/user.service";
import {Course} from "../models/course";
import {Module} from "../models/module";
import {Li} from "../models/li";

declare const chrome: any;
declare const angular: any;

@Injectable()

export class LoService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${ localStorage.getItem('jwt') }`
  });
  private apiUrl = 'https://api-dev.mygo1.com/v3';
  private videoProviders = ['youtube', 'vimeo'];
  private tabUrl: string;

  constructor(private http: Http,
              private userService: UserService) {
    const self = this;
    try {
      chrome.tabs.getSelected(null, function (tab) {
        self.tabUrl = tab.url;
      });
    } catch (e) {
    }
  }

  public fetchCourses(query): Observable<Course[]> {
    return this.http
      .get(`${ this.apiUrl }/lo-service/lo/${ localStorage.getItem('currentActivePortalId') }?${ query && 'title=' + query + '&' }type[0]=course&me=all&author=1`, {headers: this.headers})
      .map(response => Course.buildCourses(response.json()));
  }

  public createLi(course: Course, module: Module, li: Li, user): Observable<any> {
    let videoType = this.videoProviders.find(vp => {
      return this.tabUrl.indexOf(vp) > -1;
    })

    return this.http.post(`${ this.apiUrl }/lo-service/li`, {
        'author': user.mail,
        'instance': localStorage.getItem('currentActivePortalId'),
        'title': li.$title,
        'description': '',
        'published': 1,
        'type': videoType ? 'video' : 'iframe',
        'link': {
          'sourceId': module.$id,
          'weight': module.$lis.length
        },
        'data': {
          'image': null,
          'imageCover': null,
          'provider': videoType ? videoType : 'other',
          'videoType': videoType ? 'online' : undefined,
          'online': videoType && this.tabUrl,
          'path': !videoType && `https://via.go1.com/${this.tabUrl}`
        }
      },
      {headers: this.headers}
    ).map(response => response.json());
  }

  public createCourse(title: string, user): Observable<any> {
    console.log(user);
    return this.http
      .post(`${ this.apiUrl }/lo-service/lo`,
        {
          'title': title,
          'description': 'description',
          'author': user.mail,
          'data': {},
          'published': 1,
          'type': 'course',
          'instance': localStorage.getItem('currentActivePortalId'),
          'authors': [user.mail]
        },
        {headers: this.headers})
      .map(response => response.json());
  }

  public createModule(course: Course, title: string, user): Observable<any> {
    return this.http
      .post(`${ this.apiUrl }/lo-service/lo`,
        {
          'title': title,
          'description': '',
          'author': user.mail,
          'data': {'requiredSequence': false},
          'published': 1,
          'type': 'module',
          'instance': localStorage.getItem('currentActivePortalId'),
          'link': {
            'sourceId': course.$id,
            'weight': course.$modules.length
          },
          'enrollable': true,
          'courseId': course.$id
        },
        {headers: this.headers})
      .map(response => response.json());
  }
}
