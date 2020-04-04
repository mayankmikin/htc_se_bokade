import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { MapsComponent }            from '../../pages/maps/maps.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PosComponent } from 'app/pages/pos/pos.component';
import { QrComponent } from 'app/pages/qr/qr.component';
import { SearchComponent } from 'app/pages/search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonViewComponent } from 'app/button.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    AngularFirestoreModule,
    NgxQRCodeModule,
    Ng2SmartTableModule,
    NgxSpinnerModule,

    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    PosComponent,
    SearchComponent,
    QrComponent,
    ButtonViewComponent,

  ],
  entryComponents: [ButtonViewComponent],
})

export class AdminLayoutModule {}
