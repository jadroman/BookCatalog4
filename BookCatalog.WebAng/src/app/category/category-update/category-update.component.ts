import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category.model';
import { RepositoryService } from 'src/app/shared/services/repository.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {
  public errorMessage: string = '';
  public category!: Category;
  public categoryForm!: FormGroup;
  public showError!: boolean;

  constructor(private repository: RepositoryService, private router: Router,
    private activeRoute: ActivatedRoute) { }
    
    ngOnInit() {
      this.categoryForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(60)])
      });
    
      this.getCategoryById();
    }
    
    private getCategoryById = () => {
      let categoryId: string = this.activeRoute.snapshot.params['id'];
        
      let categoryByIdUrl: string = `api/category/${categoryId}`;
    
      this.repository.getData(categoryByIdUrl)
        .subscribe(res => {
          this.category = res.body as Category;
          this.categoryForm.patchValue(this.category);
        },
        (error) => {
          // log the error
          this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
          this.showError = true;
        })
    }

    public isInvalid = (controlName: string) => {
      if (this.categoryForm.controls[controlName].invalid && this.categoryForm.controls[controlName].touched)
        return true;
    
      return false;
    }
    
    public hasError = (controlName: string, errorName: string)  => {
      if (this.categoryForm.controls[controlName].hasError(errorName))
        return true;
    
      return false;
    }
        
    public redirectToCategoryList = () => {
      this.router.navigate(['/category/list']);
    }

    public updateCategory = (categoryFormValue: any) => {
      if (this.categoryForm.valid) {
        this.executeCategoryUpdate(categoryFormValue);
      }
    }
    
    private executeCategoryUpdate = (categoryFormValue: { name: string; }) => {
      this.category.name = categoryFormValue.name;
    
      let apiUrl = `api/category/${this.category.id}`;
      this.repository.update(apiUrl, this.category)
        .subscribe(res => {
          this.redirectToCategoryList();
        },
        (error => {
          // log the error
          this.errorMessage = "Unexpected error occurred, sorry for the inconvenience";
          this.showError = true;
        })
      )
    }

}
