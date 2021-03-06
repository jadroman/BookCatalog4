import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookForCreation } from 'src/app/interfaces/book/book-for-creation.mode';
import { Category } from 'src/app/interfaces/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {

  public errorMessage: string = '';
  public bookForm!: FormGroup;
  public categories!: Category[];
  public showError!: boolean;

  constructor(private repository: RepositoryService, private router: Router) { }

  ngOnInit() {
    this.bookForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      author: new FormControl('', [Validators.maxLength(56)]),
      year: new FormControl('', [Validators.max((new Date()).getFullYear())]),
      publisher: new FormControl('', [Validators.maxLength(56)]),
      collection: new FormControl('', [Validators.maxLength(56)]),
      read: new FormControl('', []),
      selectedCategory: new FormControl('', []),
      note: new FormControl('', [Validators.maxLength(1000)])
    });

    this.getCategories();

    this.bookForm.patchValue({
      read:  "false"
    });
  }

  private getCategories = () => {
    let categoryByUrl: string = `api/category`;
  
    this.repository.getData(categoryByUrl)
      .subscribe(res => {
        this.categories = res.body.items as Category[];
        this.bookForm.patchValue({
          selectedCategory:  0
        });
      },
      (error) => {
        // log the error
        this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
        this.showError = true;
      })
  }

  public isInvalid = (controlName: string) => {
    if (this.bookForm.controls[controlName].invalid && this.bookForm.controls[controlName].touched)
      return true;
  
    return false;
  }
  
  public hasError = (controlName: string, errorName: string)  => {
    if (this.bookForm.controls[controlName].hasError(errorName))
      return true;
  
    return false;
  }

  public createBook = (bookFormValue: any) => {
    if (this.bookForm.valid) {
      this.executeBookCreation(bookFormValue);
    }
  }

  public redirectToBookList = () => {
    this.router.navigate(['/book/list']);
  }

  private executeBookCreation = (bookFormValue: any)  => {
    const book: BookForCreation = {
      title: bookFormValue.title,
      author: bookFormValue.author,
      note: bookFormValue.note,
      publisher: bookFormValue.publisher,
      read: bookFormValue.read,
      year: bookFormValue.year,
      collection: bookFormValue.collection,
      categoryId: (bookFormValue.selectedCategory != 0) ? bookFormValue.selectedCategory : null
    }

    const apiUrl = 'api/book';

    this.repository.create(apiUrl, book)
      .subscribe(res => {
        this.redirectToBookList();
      },
        (error => {
          // log the error
          this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
          this.showError = true;
        })
      )
  }
  

}
