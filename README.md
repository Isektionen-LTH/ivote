# I-vote

I-Sektionen vid LTHs röstningssystem för årsmöten

## Förutsättningar

För att installera och köra ivote krävs git, docker, docker-compose och Node.js.

## Köra i produktion

Börja med att installera all programvara i Prerequities genom knivskarpa googlingar!

Ladda sedan ned projektet genom att köra 

```
$ git clone https://github.com/Isektionen-LTH/ivote.git
```

Gör sedan en setup där du skriver in alla parametrar för att köra I-vote.

```
$ cd ivote
$ npm run setup
```

Starta systemet genom att köra

```
$ npm run prod
```

## Använda systemet
Systemet består av 3 stycken delar.

* Admin
* Registrerare
* Användare

Under admin finns följande sidor:
* /admin - hantera omröstningar
* /results - se resultat på avslutade omröstningar
* /admin/users - hantera användare

Under registeraren finns en sida:
* /register - registrera nya användare

Under användare finns en sida:
* /vote - rösta på den aktuella omröstningen

## Utveckla

Projektet körs för utveckling genom att köra

```
$ npm run dev
```

### Server

Servern är skriven i Node.js och den mesta serverkoden finns i `app`
Servern startas om genom att köra `npm run dev`

### Klient

Klienten är skriven i React + Redux och koden finns i `client`
För att ändringar ska visas måste

```
$ npm run build
```
köras i `client`-mappen


## Authors

* **John Rapp Farnes**
* **Kristoffer Nordström**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
