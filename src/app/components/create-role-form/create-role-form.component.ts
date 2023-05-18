import { Permission } from '@/models/permission';
import {CreateRoleRequest, EditRoleRequest, GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, Inject, OnInit, PipeTransform } from '@angular/core';
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
  public ActionTitle : string = "Agregar"
  formGroup: FormGroup;
  selectedPermissions: { permissionId: string }[] = [];
  public roleData

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
  ){}

  ngOnInit() {

    this.store.dispatch(new GetAllPermissionsRequest())
    this.ui = this.store.select('ui')
    this.ui.subscribe((state:UiState)=>{
      this.permissionList = state.allPermissions.data
    })

    this.formGroup = this.fb.group({
      name: ['',Validators.required],
      status: [0,Validators.required],
      associatedPermission: [this.selectedPermissions,Validators.required]
    })

    if (this.roleData!=null) {

      this.ActionTitle = "Editar"
      this.formGroup.setValue({
        name: this.roleData.name,
        status: this.roleData.status,
        associatedPermission: this.selectedPermissions
      })

      this.permissionList.forEach(item=>{
        console.log(item)
        item["temporalStatus"]=false;
          item.associatedPermission?.forEach(ap=>{
            if (ap.roleId==this.roleData["roleId"]) {
              item["temporalStatus"]=true;
            }
          })
      })

      this.selectedPermissions=this.permissionList;

    }

  }


  assignpermissiontolist(permiso:any){

    permiso = permiso["permissionId"]
    const existingIndex = this.selectedPermissions.findIndex(item => item.permissionId === permiso);

    if (existingIndex !== -1) {
      this.selectedPermissions.splice(existingIndex, 1);
    } else {
      this.selectedPermissions.push({ permissionId: permiso });
    }

    console.log(this.selectedPermissions)
  }

  saveChanges(){
    console.log("pua",this.roleData)
    if (this.roleData===null) {
      const model : Role = {
        name : this.formGroup.value.name,
        status : this.formGroup.value.status,
        associatedPermission: this.selectedPermissions
      }

      this.store.dispatch(new CreateRoleRequest({
        ...model
      }));
    }else{
      const model : Role = {
        roleId: this.roleData.roleId,
        name : this.formGroup.value.name,
        status : this.formGroup.value.status,
      }
      this.store.dispatch(new EditRoleRequest({
        ...model
      }));
    }


    // this.selectedPermissions.forEach(permiso => {
    //   const model : AssociatedPermission = {
    //     roleId : this.formGroup.value.name,
    //     permissionId : permiso.permissionId,
    //   }
    // });

  }

  validForm(): boolean {

    //return this.formGroup.valid && this.formGroup.value.status != 0
    return true
  }

  cancel() {
    this.modalService.dismissAll();
  }

}
