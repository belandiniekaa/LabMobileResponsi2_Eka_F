import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pahlawan',
  templateUrl: './pahlawan.page.html',
  styleUrls: ['./pahlawan.page.scss'],
})
export class PahlawanPage implements OnInit {
  dataPahlawan: any;
  modalTambah: any;
  id: any;
  namaPahlawan: any;
  kisah: any;
  modalEdit: any;
  namaUser: any;

  resetModal() {
    this.id = null;
    this.namaPahlawan = '';
    this.kisah = '';
  }
  
  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilPahlawan(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  constructor(private api: ApiService, private modal: ModalController, private alertController: AlertController, private authService: AuthenticationService, private router: Router) { this.namaUser = this.authService.nama }

  ngOnInit() {
    this.getPahlawan();
  }

  getPahlawan() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataPahlawan = res.filter((item: any) => 
          item && item.nama && item.kisah && 
          item.nama.trim() !== '' && item.kisah.trim() !== ''
        );
      },
      error: (err: any) => {
        console.log('Error:', err);
        this.alertController.create({
          header: 'Error',
          message: 'Gagal mengambil data: ' + err.message,
          buttons: ['OK']
        }).then(alert => alert.present());
      },
    });
  }

  async konfirmasiHapus(id: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Hapus dibatalkan');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.hapusPahlawan(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async tambahPahlawan() {
    if (this.namaPahlawan != '' && this.kisah != '') {
      let data = {
        nama: this.namaPahlawan,
        kisah: this.kisah,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: async (hasil: any) => {
            this.modalTambah = false;
            this.modal.dismiss();
            this.resetModal();
            await new Promise(resolve => {
              this.getPahlawan();
              resolve(true);
            });

            const alert = await this.alertController.create({
              header: 'Sukses',
              message: `Data pahlawan ${this.namaPahlawan} berhasil ditambahkan`,
              buttons: ['OK']
            });
  
            await alert.present();
          },
          error: async (err: any) => {
            console.log('gagal tambah pahlawan');

            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Gagal menambahkan data pahlawan',
              buttons: ['OK']
            });
  
            await alert.present();
          }
        })
    } else {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Nama dan kisah harus diisi',
        buttons: ['OK']
      });
  
      await alert.present();
      console.log('gagal tambah pahlawan karena masih ada data yg kosong');
    }
  }

  hapusPahlawan(id: any) {
    this.api.hapus(id,
      'hapus.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getPahlawan();
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
  }

  ambilPahlawan(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let pahlawan = hasil;
          this.id = pahlawan.id;
          this.namaPahlawan = pahlawan.nama;
          this.kisah = pahlawan.kisah;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }

  async editPahlawan() {
    if (this.namaPahlawan != '' && this.kisah != '') {
      let data = {
        id: this.id,
        nama: this.namaPahlawan,
        kisah: this.kisah
      }
      this.api.edit(data, 'edit.php')
        .subscribe({
          next: async (hasil: any) => {
            console.log(hasil);
            this.resetModal();
            this.getPahlawan();
            console.log('berhasil edit pahlawan!');
            this.modalEdit = false;
            this.modal.dismiss();

            const alert = await this.alertController.create({
              header: 'Sukses',
              message: `Data pahlawan ${this.namaPahlawan} berhasil diubah`,
              buttons: ['OK']
            });
  
            await alert.present();
          },
          error: async (err: any) => {
            console.log('gagal edit pahlawan');
            
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Gagal mengubah data pahlawan',
              buttons: ['OK']
            });
  
            await alert.present();
          }
        })
    } else {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Nama dan kisah harus diisi',
        buttons: ['OK']
      });
  
      await alert.present();
      console.log('gagal edit pahlawan karena masih ada data yg kosong');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}