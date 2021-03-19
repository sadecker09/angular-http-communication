import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from "@angular/common/http/testing";

import { DataService } from "./data.service";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";

// suite of tests defined by describe() function
describe("DataService Tests", () => {
  // initialize inside of beforeEach() instead of here; get from TestBed (testing environment)
  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  let testBooks: Book[] = [
    {
      bookID: 1,
      title: "Goodnight Moon",
      author: "Margaret Wise Brown",
      publicationYear: 1953,
    },
    {
      bookID: 2,
      title: "Winnie-the-Pooh",
      author: "A. A. Milne",
      publicationYear: 1926,
    },
    {
      bookID: 3,
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      publicationYear: 1937,
    },
  ];

  // initialization code that should run before each test
  beforeEach(() => {
    // configure testing environment
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // this serves as the HTTP backend
      providers: [DataService], // to receive an instance of this service from the injector
    });

    dataService = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    //tests that all HTTP requests have been handled and none are still pending
    httpTestingController.verify();
  });

  it("should GET all books", () => {
    dataService.getAllBooks().subscribe((data: Book[] | BookTrackerError) => {
      expect((<Book[]>data).length).toBe(3); // should be the testBooks that are added to the body below in the flush() call
    });
    // set up a mock request
    let booksRequest: TestRequest = httpTestingController.expectOne(
      "/api/books"
    );
    expect(booksRequest.request.method).toEqual("GET");

    // add books to the body of the response sent to the calling code
    booksRequest.flush(testBooks);
  });

  it("should return a BookTrackerError", () => {
    dataService.getAllBooks().subscribe(
      // first param = success handler which shouldn't get called
      // before we testing an error so call Jasmine's fail()
      (data: Book[] | BookTrackerError) =>
        fail("this should have been an error"),
      // 2nd param = error handler which should receive a BookTrackerError object
      (err: BookTrackerError) => {
        expect(err.errorNumber).toEqual(100);
        expect(err.friendlyMessage).toEqual(
          "An error occurred while retrieving data."
        );
      }
    );

    let booksRequest: TestRequest = httpTestingController.expectOne(
      "/api/books"
    );

    // simulate HTTP error response
    // this will trigger the error handling code in dataService
    booksRequest.flush("error", {
      // mock a server error
      status: 500,
      statusText: "Server Error",
    });
  });
});
