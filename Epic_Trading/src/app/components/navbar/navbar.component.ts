import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  originalUserInfo!: {
    id:string,
    name: string,
     email: string,phoneNumber: string,
      surname: string,
       username: string,
       balance: number,
      portfolioStock:{
      purchasePrice:number,
      id:string},
      transaction:{
        amount:number,
        transactionType: string,
        order:{
          marketData:{
          name:string,
          symbol:string,
          }
          quantity:number
        }
      }
  };





  currentUserInfo!: {
    id:string,
    name: string,
     email: string,phoneNumber: string,
      surname: string,
       username: string,
       balance: number,
      portfolioStock:{
      purchasePrice:number,
      id:string},
      transaction:{
        amount:number,
        transactionType: string,
        order:{
          marketData:{
          name:string,
          symbol:string,
          }
          quantity:number
        }
      }
  };
  constructor( private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      this.originalUserInfo = { ...userInfo };
      this.currentUserInfo = { ...userInfo };
      this.currentUserInfo = userInfo;
      console.log(this.currentUserInfo);

    });
  }



  logOut(): void {
    this.authService.logout();

  }





  openSettingsModal() {
    // Apre la modale quando viene fatto clic su "Settings"
    const settingsModal = document.getElementById('modalOk');
    if (settingsModal) {
      settingsModal.classList.add('show');
      settingsModal.style.display = 'block';
    }
  }

  closeSettingsModal() {
    // Chiude la modale
    const settingsModal = document.getElementById('modalOk');
    if (settingsModal) {
      settingsModal.classList.remove('show');
      settingsModal.style.display = 'none';
    }
  }



  isFormDirty = false;
  cancelPutUser():void{
    this.currentUserInfo = { ...this.originalUserInfo };
    this.isFormDirty=false
  }

  updateUser(userId: string ): void {
    this.authService.updateUser(userId, this.currentUserInfo).subscribe(
      (response) => {
        console.log('Utente aggiornato con successo:', response);
        this.isFormDirty = false;
        this.showModalOk = true;
      },
      (error) => {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);

      }
    );
  }



  onFieldChange(): void {
    this.isFormDirty = true;
    this.showModalOk = true;
  }

  showModalOk = false;


test():void{
  this.showModalOk = true;
}

}
