import { Permission } from '@/models/permission';
import {CreateAssociatedPermissionRequest, CreateRoleRequest, DeleteAssociatedPermissionRequest, EditRoleRequest, GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, Inject, OnInit, PipeTransform } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { AppState } from '@/store/state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from '@/models/role';
import { AssociatedPermission } from '@/models/associated-permission';
import { state } from '@angular/animations';



@Component({
  selector: 'app-create-role-form',
  templateUrl: './create-role-form.component.html',
  styleUrls: ['./create-role-form.component.scss']
})
export class CreateRoleFormComponent implements OnInit{

  formGroup: FormGroup;
  public ui:Observable<UiState>
  public ActionTitle : string = "Agregar"
  public permissionList : Array<any>
  public AllRoles : Array<any>
  public selectedPermissions: { permissionId: any ,module:string}[] = [];
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
      this.AllRoles = state.allRoles.data
      this.roleData = state.oneRole.data
    })

    this.formGroup = this.fb.group({
      name: ['',
        [Validators.required, Validators.minLength(3),Validators.maxLength(20)]
      ],
      status: [0,Validators.required],
      associatedPermission: [this.selectedPermissions]
    })

    if (this.roleData!=null) {
      this.ActionTitle = "Editar"
      this.formGroup.setValue({
        name: this.roleData.name,
        status: this.roleData.status,
        associatedPermission: [this.selectedPermissions,Validators.required]
      })

      this.roleData.associatedPermission.forEach(rolpermiso=>{
        this.assignpermissiontolist(rolpermiso.permission)
      })
    }

  }

  assignpermissiontolist(permiso:any){

    const existingIndex = this.selectedPermissions.findIndex(item => item.permissionId === permiso["permissionId"]);

    if (existingIndex !== -1) {
      this.selectedPermissions.splice(existingIndex, 1);
    } else {
      this.selectedPermissions.push({ permissionId: permiso["permissionId"], module : permiso["module"]});
    }

  }

  isAssociated(permiso:any):boolean{
    var associated = false
    if(this.roleData!=null){
      permiso.associatedPermission.forEach(ap=> {
        if (ap.roleId==this.roleData.roleId) {
          associated = true
        }
      });
    }
    return associated
  }


  saveChanges(){

    if (this.roleData==null) {
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
        roleId : this.roleData.roleId,
        name : this.formGroup.value.name,
        status : this.formGroup.value.status,
      }

      this.UpdatingPermissionRoleAssignment()

      this.store.dispatch(new EditRoleRequest({
            ...model
      }));



    }
  }

  UpdatingPermissionRoleAssignment(){

    var associatedPermission = this.roleData.associatedPermission

    //DELETE
    for (var ap in associatedPermission) {
      var existsAp = this.selectedPermissions.find(item => item.permissionId === associatedPermission[ap].permissionId);
      if (existsAp==null) {
        const assocPerModelDelete : AssociatedPermission = {
          associatedPermissionId : associatedPermission[ap].associatedPermissionId,
        }
        this.store.dispatch(new DeleteAssociatedPermissionRequest({
          ...assocPerModelDelete
        }));
      }
    }

    //CREATE
    var selectedPermission = this.selectedPermissions
    for (var sp in selectedPermission) {
      var existsSp = associatedPermission.find(item => item.permissionId === selectedPermission[sp].permissionId);
      if (existsSp==null) {
        var assocPerModelCreate : AssociatedPermission = {
          roleId : this.roleData.roleId,
          permissionId : selectedPermission[sp].permissionId,
        }
        this.store.dispatch(new CreateAssociatedPermissionRequest({
          ...assocPerModelCreate
        }));
      }
    }

  }


  validForm(): boolean {
    if (this.roleData==null) {
      return this.formGroup.valid
      && this.formGroup.value.status != 0
      && !this.AllRoles.find(item => item.name === this.formGroup.value.name)
      && this.selectedPermissions.length>0
    }else{
      return this.formGroup.valid
      && this.formGroup.value.status != 0
      && !this.AllRoles.find(
        item => item.name === this.formGroup.value.name
        && item.roleId !== this.roleData.roleId)
      && this.selectedPermissions.length>0
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }

}
