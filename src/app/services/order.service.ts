import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  @Output() DataTrigger = new EventEmitter<any>();

  constructor(
  ) { }
}
