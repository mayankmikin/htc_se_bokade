import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { PosComponent } from 'app/pages/pos/pos.component';
import { QrComponent } from 'app/pages/qr/qr.component';
import { SearchComponent } from 'app/pages/search/search.component';
import { GuidelinesComponent } from 'app/pages/guidelines/guidelines.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'search',           component: SearchComponent },
    { path: 'dashboard',      component: SearchComponent },
    //{ path: 'user',           component: UserComponent },
    // { path: 'table',          component: TableComponent },
    // { path: 'typography',     component: TypographyComponent },
    // { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'pos',          component: PosComponent },
    { path: 'guidelines',           component: GuidelinesComponent },
    { path: 'qr',           component: QrComponent },


   // { path: 'upgrade',        component: UpgradeComponent }
];
