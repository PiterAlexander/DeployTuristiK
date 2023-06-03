import { Permission } from '@/models/permission';
import {CreateAssociatedPermissionRequest, CreateRoleRequest, DeleteAssociatedPermissionRequest, EditRoleRequest, GetAllPermissionsRequest, OpenModalCreateRole } from '@/store/ui/actions';
import { Component, Inject, OnInit, PipeTransform } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiState } from '@/store/ui/state';
import { AppState } from '@/store/state';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from '@/models/role';
import { AssociatedPermission } from '@/models/associated-permission';
import { state } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-role-form',
  templateUrl: './create-role-form.component.html',
  styleUrls: ['./create-role-form.component.scss']
})
export class CreateRoleFormComponent implements OnInit{

  formGroup: FormGroup;
  public ui:Observable<UiState>
  public actionTitle : string = "Agregar"
  public permissionList : Array<any>
  public AllRoles : Array<any>
  public selectedPermissions: { permissionId: any ,module:string,status?:boolean}[] =[];
  public selectedUpdatePermissions: any[] = [];
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
      name: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]),
      status: [0,Validators.required],
      associatedPermission: new FormControl([this.selectedPermissions],Validators.minLength(1))
    })

    if (this.roleData!=null) {

      this.roleData.associatedPermission.forEach(rolpermiso=>{
        this.assignpermissiontolist(rolpermiso.permission)
      })

      this.actionTitle = "Editar"
      this.formGroup.setValue({
        name: this.roleData.name,
        status: this.roleData.status,
        associatedPermission: [this.selectedPermissions,Validators.required]
      })

    }

  }


  //CREATE UPDATE ROLE AND ASSING PERMISSIONS-----------------------

  assignpermissiontolist(permiso:any){

    const existingIndex = this.selectedPermissions.findIndex(item => item.permissionId === permiso["permissionId"]);

    if (existingIndex !== -1) {
      this.selectedPermissions.splice(existingIndex, 1);
    } else {
      this.selectedPermissions.push({ permissionId: permiso["permissionId"], module : permiso["module"]});
    }


    console.log("Pemisos ASOCIADOS")
    console.log(this.selectedPermissions)
    this.selectedPermissions.forEach(element => {
      console.log("MOdulo",element.module, "Id",element.permissionId)
    });

  }

  saveChanges(){

    if (this.formGroup.invalid) {
      return;
    }else{
      if (this.roleData==null) {
        const model : Role = {
          name : this.formGroup.value.name,
          status : this.formGroup.value.status,
          associatedPermission: this.selectedPermissions
        }

        this.store.dispatch(new CreateRoleRequest({
          ...model
        }));

        Swal.fire({
          icon: 'success',
          title: 'El rol se agreró exitosamente',
          showConfirmButton: false,
          timer: 3500
        }).then(function(){
          //console.log('El rol se agreró exitosamente')
        })

      }else{

        const model : Role = {
          roleId : this.roleData.roleId,
          name : this.formGroup.value.name,
          status : this.formGroup.value.status,
        }

        this.updatingPermissionRoleAssignment()

        this.store.dispatch(new EditRoleRequest({
              ...model
        }));

        Swal.fire({
          icon: 'success',
          title: 'El rol se editó exitosamente',
          showConfirmButton: false,
          timer: 3500
        }).then(function(){
          //console.log('El rol se editó exitosamente')
        })

      }
    }
  }

  updatingPermissionRoleAssignment(){

    if(this.roleData.roleId!=null){

      //ADD ASSOCIATED PERMISSION TO DELETE
      const associatedPermission = this.roleData.associatedPermission
      associatedPermission.forEach(ap => {
        const existsAp = this.selectedPermissions.find(item => item.permissionId === ap.permissionId);
        if (existsAp==null) {
          this.selectedUpdatePermissions.push({
            associatedPermissionId:ap.associatedPermissionId,
            status:false
          });
        }
      });

      //ADD ASSOCIATED PERMISSION TO CREATE
      const selectedPermission = this.selectedPermissions
      selectedPermission.forEach(sp=>{
        const existsSp = this.roleData.associatedPermission.find(item => item.permissionId === sp.permissionId);
        if (existsSp==null) {
          this.selectedUpdatePermissions.push({
            status:true,
            module:sp.module,
            roleId:this.roleData.roleId,
            permissionId:sp.permissionId
          });
        }
      })

      //UPDATE
      this.selectedUpdatePermissions.forEach(updateItem =>{
        if (updateItem.status === false) {
          //console.log(updateItem, "Se Elimina")
          const assocPerModelDelete : AssociatedPermission = {
            associatedPermissionId: updateItem.associatedPermissionId
          }
          this.store.dispatch(new DeleteAssociatedPermissionRequest({
            ...assocPerModelDelete
          }));
        }else{
          //console.log(updateItem, "Se crea")
          const assocPerModelCreate : AssociatedPermission = {
            roleId : updateItem.roleId,
            permissionId : updateItem.permissionId,
          }
          this.store.dispatch(new CreateAssociatedPermissionRequest({
          ...assocPerModelCreate
          }));
        }
      })

    }

  }



  //VALIDACIONES---------------------------------------------------

  isPermissionAssociated(permiso:any):boolean{
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

  validateExistingRoleName():boolean{
    if (this.roleData==null) {
      if(this.AllRoles.find(item => item.name === this.formGroup.value.name)){
        console.log("Existe")
        return true
      }
    }else{
      return this.AllRoles.find(
        item => item.name === this.formGroup.value.name
        && item.roleId !== this.roleData.roleId)
    }
  }

  validateAssociatedPermissions():boolean {
    return this.selectedPermissions.length>0
  }

  //-----------------------------------------------------------------
  cancel() {
    this.modalService.dismissAll();
  }

}
