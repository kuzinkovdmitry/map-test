import { NgModule } from '@angular/core';
import {MatButtonModule, MatIconModule, MatTreeModule} from '@angular/material';

const MATERIAL_MODULES = [
  MatIconModule,
  MatTreeModule,
  MatButtonModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule {
}
