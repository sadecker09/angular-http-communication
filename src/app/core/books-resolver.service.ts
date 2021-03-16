import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { Book } from "app/models/book";
import { DataService } from "app/core/data.service";
import { BookTrackerError } from "app/models/bookTrackerError";

@Injectable({
  providedIn: "root",
})
export class BooksResolverService
  implements Resolve<Book[] | BookTrackerError> {
  constructor(private dataService: DataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Book[] | BookTrackerError> {
    // subscribing to this observable not needed; Angular will do this automatically
    // and pass along the resolved data as part of the route transition
    return this.dataService.getAllBooks().pipe(catchError((err) => of(err)));
  }
}
