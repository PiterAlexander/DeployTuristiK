import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  @Output() DataTrigger = new EventEmitter<any>();

  constructor(
  ) { }


}
