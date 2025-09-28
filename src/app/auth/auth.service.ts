import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {User} from "./model/user.model";
import { HttpClient } from "@angular/common/http";




@Injectable()
export class AuthService {

    constructor(private http:HttpClient) {

    }

    login(email:string, password:string): Observable<User> {
        return this.http.post<User>('/api/login', {email,password});
    }

}
