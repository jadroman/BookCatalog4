﻿using BookCatalog.Common.BindingModels.Book;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Components
{
    public partial class CategoryTable
    {
        [Parameter]
        public List<CategoryBindingModel> Categories { get; set; }

        [Parameter]
        public EventCallback<int> OnDeleted { get; set; }

        [Parameter]
        public bool IsLoading { get; set; }

        [Inject]
        public NavigationManager NavigationManager { get; set; }

        private void RedirectToUpdate(int id)
        {
            var url = Path.Combine("/category/", id.ToString());
            NavigationManager.NavigateTo(url);
        }
    }
}
