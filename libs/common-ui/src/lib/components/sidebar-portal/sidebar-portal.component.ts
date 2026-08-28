import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { SidebarPortalService } from '..';

@Component({
  selector: 'lib-sidebar-portal',
  imports: [],
  templateUrl: './sidebar-portal.component.html',
  styleUrl: './sidebar-portal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarPortalComponent implements AfterViewInit, OnDestroy {
  portalContent = viewChild('portalContent', { read: TemplateRef });
  sidebarPortalService = inject(SidebarPortalService);

  ngAfterViewInit() {
    const portalContent = this.portalContent();

    if (!portalContent) return;

    this.sidebarPortalService.render(portalContent);
  }

  ngOnDestroy() {
    this.sidebarPortalService.destroy();
  }
}
