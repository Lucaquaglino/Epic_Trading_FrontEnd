import { Component, OnInit, ViewChild } from '@angular/core';
import { Transactions } from 'src/app/models/transactions.interface';
import { AppService } from 'src/app/services/app.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],

})
export class ControlPanelComponent implements OnInit {
  email: string = '';
    page = 0; // Imposta la pagina iniziale
    pageSize =10;




    totalPages = 0;
    currentPage = 0;
    transaction: Transactions[] = [];
    newTransaction: Transactions = {
      "timeStamp":"",
      "amount": null!,
      "currency": "",
      "transactionType": "",
      "order": {
        "timeStamp": "",
        "quantity": null!,
        "orderType": "",
        "marketData": {
          "name": "",
          "symbol": "",
          "price": null!,
          "volume": null!,
          "timeStamp": ""
        }
      }
    }

    constructor(private AppService: AppService, private router: Router) {}



      ngOnInit(): void {


        this.loadTransaction();
        // setInterval(() => {
        //   this.loadTransaction();
        // }, 10000);
      }


// porto mail getstarted nel register
      submitForm(form: NgForm) {
        const userEmail = form.value.email;
        this.router.navigate(['/register'], { queryParams: { email: userEmail } });
      }

    loadTransaction(): void {

      this.AppService.getTransaction(this.page, 'id').subscribe(
        (transaction : Transactions[]) => {
          console.log(transaction);
          this.transaction = transaction;
        },
        (error) => {
          console.error("Error fetching transaction:", error);
        }
      );
    }



      nextPage() {
        this.page++; // Vai alla pagina successiva
        this. loadTransaction();

      }

      previousPage() {
        if (this.page > 0) {
          this.page--; // Vai alla pagina precedente solo se non sei sulla prima pagina
          this. loadTransaction();
        }
      }


    // creaNuovoCliente() {
    //   this.provinciaService.creaCliente(this.nuovoCliente).subscribe(
    //     (clienteCreato: Clienti) => {
    //       console.log('Cliente creato:', clienteCreato);
    //       // Resetta i campi del nuovo cliente
    //       this.nuovoCliente = {
    //         "idCliente":"",
    //          "ragioneSociale": "",
    //       "partitaIva":"",
    //       "emailCliente":"",
    //       "pec":"",
    //       "telefonoCliente":null!,
    //       "tipoCliente":"",
    //       "nomeContatto":"",
    //       "cognomeContatto":"",
    //       "emailContatto":"",
    //       "telefonoContatto":"",
    //       "viaUno":"",
    //       "civicoUno":null!,
    //       "localitaUno":"",
    //       "capUno":"",
    //       "comuneUno":"",
    //       "viaDue":"",
    //       "civicoDue":null!,
    //       "localitaDue":"",
    //       "capDue":"",
    //       "comuneDue":"",
    //       "dataInserimento":"",
    //       "ultimoContatto":"",
    //       "fatturatoAnnuale":null!,
    //       "fatture": undefined,
    //     "indirizzoSedeLegale": undefined,
    //     "civico":""
    //     };
    //       // Ricarica la lista dei clienti dopo la creazione
    //       // this.loadClienti();
    //     },
    //     (error) => {
    //       console.error('Errore durante la creazione del cliente:', error);
    //     }
    //   );
    // }



    // // getFiltroRagioneSociale():void {

    // //   const rg="ciao";
    // //   const page = 0;
    // //   const pageSize =10;
    // //   this.provinciaService.getClientiRagioneSociale(page,pageSize,rg).subscribe((response)=>{
    // //     console.log( "filtro",response)},
    // //     (error)=>{
    // //       console.error(error)
    // //     }
    // //   )
    // //   }

    //   onDeleteCliente(id: string): void {
    //     this.provinciaService.deleteCliente(id).subscribe(
    //       () => {
    //         console.log('Cliente eliminato con successo.');
    //         this.clienti = this.clienti.filter(cliente => cliente.idCliente !== id);
    //       },
    //       (error) => {
    //         console.error("Errore durante eliminazione cliente" , error);

    //       }
    //     );
    //   }


    //   applyFatturatoFilter(): void {
    //     this.provinciaService.getClientiByFatturatoAnnuale(this.fatturatoAnnuale, this.page, this.pageSize).subscribe(
    //       (clienti: Clienti[]) => {
    //         console.log(clienti);
    //         this.clienti = clienti;
    //       },
    //       (error) => {
    //         console.error("Error fetching clienti:", error);
    //       }
    //     );
    //   }


    //   applyDataInserimentoFilter(): void {
    //     this.provinciaService.getClientiByDataInserimento(this.dataInserimento, this.page, this.pageSize).subscribe(
    //       (clienti: Clienti[]) => {
    //         console.log(clienti);
    //         this.clienti = clienti;
    //       },
    //       (error) => {
    //         console.error("Error fetching clienti:", error);
    //       }
    //     );
    //   }


    //   applyDataUltimoContattoFilter(): void {
    //     this.provinciaService.getClientiByDataUltimoContatto(this.dataUltimoContatto, this.page, this.pageSize).subscribe(
    //       (clienti: Clienti[]) => {
    //         console.log(clienti);
    //         this.clienti = clienti;
    //       },
    //       (error) => {
    //         console.error("Error fetching clienti:", error);
    //       }
    //     );
    //   }
    //   applyParteRagioneSocialeFilter(): void {
    //     this.provinciaService.getClientiByParteRagioneSociale(this.parteRagioneSociale, this.page, this.pageSize).subscribe(
    //       (clienti: Clienti[]) => {
    //         console.log(clienti);
    //         this.clienti = clienti;
    //       },
    //       (error) => {
    //         console.error("Error fetching clienti:", error);
    //       }
    //     );
    //   }


}
