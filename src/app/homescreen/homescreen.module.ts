import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomescreenPageRoutingModule } from './homescreen-routing.module';

import { HomescreenPage } from './homescreen.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomescreenPageRoutingModule,
    RouterModule.forChild([{ path: '', component: HomescreenPage }])

  ],
  declarations: [HomescreenPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class HomescreenPageModule {}
