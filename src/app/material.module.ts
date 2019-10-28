
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSelectModule,
    MatCardModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatSelectModule,
        MatCardModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatSelectModule,
        MatCardModule
    ]
})

export class MaterialModule { }