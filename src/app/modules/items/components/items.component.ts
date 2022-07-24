import { Component, OnInit } from '@angular/core';
import { ItemsApiService } from '../services/items-api.service';
import { Item } from '../interface/item';

@Component({
  selector: 'app-items',
  template: `
    <p>
      items works!
    </p>
    <pre> {{items | json}}</pre>
  `
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];

  constructor(private itemsApi: ItemsApiService) { }

  ngOnInit(): void {
    this.itemsApi.getItems().subscribe(items => {
      console.log(items);
      this.items = items
    })
  }

}
