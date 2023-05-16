import { Permission } from '@/models/permission';
import {CreateRoleRequest, GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { AppState } from '@/store/state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from '@/models/role';
import { AssociatedPermission } from '@/models/associated-permission';


@Component({
  selector: 'app-create-role-form',
  templateUrl: './create-role-form.component.html',
  styleUrls: ['./create-role-form.component.scss']
})
export class CreateRoleFormComponent implements OnInit{

  public ui:Observable<UiState>
  public permissionList : Array<Permission>
  formGroup: FormGroup;
  selectedPermissions: { permissionId: string }[] = [];

  constructor(private fb: FormBuilder, private modalService: NgbModal,private store: Store<AppState>){}

  ngOnInit() {

    this.formGroup = this.fb.group({
      name: ['',Validators.required],
      status: [0,Validators.required],
      associatedPermission: [this.selectedPermissions,Validators.required]
    })

    this.store.dispatch(new GetAllPermissionsRequest())
    this.ui = this.store.select('ui')
    this.ui.subscribe((state:UiState)=>{
      this.permissionList = state.allPermissions.data
    })
  }

  assignpermissiontolist(permiso:any){

    permiso = permiso["permissionId"]
    const existingIndex = this.selectedPermissions.findIndex(item => item.permissionId === permiso);

    if (existingIndex !== -1) {
      this.selectedPermissions.splice(existingIndex, 1);
    } else {
      this.selectedPermissions.push({ permissionId: permiso });
    }


    // if (this.selectedPermissions.includes(permiso)) {
    //   this.selectedPermissions = this.selectedPermissions.filter(i => i !== permiso);
    // } else {
    //   this.selectedPermissions.push(permiso);
    // }

  }

  saveRoleAndAssociatePermissions(){

    const model : Role = {
      name : this.formGroup.value.name,
      status : this.formGroup.value.status,
      associatedPermission: this.selectedPermissions
    }

    console.log(model)
    var id = this.store.dispatch(new CreateRoleRequest({
      ...model
    }));

    console.log("JUST COMON ",id)

    this.selectedPermissions.forEach(permiso => {
      const model : AssociatedPermission = {
        roleId : this.formGroup.value.name,
        permissionId : permiso.permissionId,
      }
    });
  }

  validForm(): boolean {

    //return this.formGroup.valid && this.formGroup.value.status != 0
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
