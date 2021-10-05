# StopWatch Anything

Este componente permite insertar un cronometro en cualquier Record Page de Salesforce y guardar tanto el inicio como el fin y/o la duración en cualquier campo del objeto.

## Como se instala?

Para instalarlo se puede hacer click en el siguiente boton.
<a href="https://githubsfdeploy.herokuapp.com?owner=joaquintegui&repo=stopwatchAnything&ref=main">
![Deploy to Salesforce](https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png "Deploy to Salesforce")
</a>

## Configurar el componente

Al configurar el componente en una pagina se nos piden 3 campos y hay dos casilleros a completar.

* **Campo de comienzo:** En este campo se listan todos los campos de tipo DateTime del objeto. Este campo sera donde se guarde (si el campo es editable) el momento que se hace click en empezar y donde empezara el cronometro tanto si es haciendo click en empezar o si se actualiza de otro modo.
* **Campo de Finzalización**: En este campo se listan todos los campos de tipo DateTime del objeto. Este campo sera donde se guarde (si el campo es editable) el momento que se hace click en Parar y donde calculara el final el cronometro tanto si es haciendo click en Parar o si se actualiza de otro modo.
* **Campo de Duración**: En este campo se listan todos los campos de tipo Número del objeto. Este campo sera donde se guarde (si el campo es editable) La diferecia entre el inicio y el fin o bien el tiempo neto en que el cronometro funciono.
* **Mostrar Campo Reset**: Si esta casilla esta chequeada se mostrara un boton para resetear el cronometro (y los campos editables) a 0.
* **Modo tiempo Neto**: En este modo no se calcula la duración con los campos de incio y fin sino que se usa unicamente el campo duracieon que es editado cada vez que el cronometro se para.


