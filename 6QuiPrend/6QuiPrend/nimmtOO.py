from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame
from players.botFaible import botFaible #bot1
from players.botFort import botFort
from players.botRandom import botRandom
from players.botCustomPlayer import BotCustomPlayer
from players.botEchantillon import botEchantillon
from players.botMinMax import botMinMax
from players.botRandom import botRandom
from flask import Flask, render_template, request, redirect, url_for, send_file
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import random

app = Flask(__name__)

def interactiveRun(number):
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            players=[]
            if number == "1":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(botEchantillon("botEchantillon"))

            if number == "2":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(botFaible("botFaible"))

            if number == "3":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(botFort("botFort"))

            if number == "4":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(botMinMax("botMinMax"))

            if number == "5":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(botRandom("botRandom"))

            if number == "6":
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(HumanPlayer("HumanPlayer"))

            if number == "7":
                players.append(botFaible("botFaible"))
                players.append(botEchantillon("botEchantillon"))

            if number == "7":
                players.append(botFort("botFort"))
                players.append(botEchantillon("botEchantillon"))

            if number == "8":
                players.append(botMinMax("botMinMax"))
                players.append(botEchantillon("botEchantillon"))

            if number == "9":
                players.append(botRandom("botRandom"))
                players.append(botEchantillon("botEchantillon"))

            if number == "10":
                players.append(HumanPlayer("HumanPlayer"))
                players.append(botEchantillon("botEchantillon"))

            if number == "11":
                players.append(botFaible("botFaible"))
                players.append(botFort("botFort"))

            if number == "12":
                players.append(botFaible("botFaible"))
                players.append(botMinMax("botMinMax"))

            if number == "13":
                players.append(botFaible("botFaible"))
                players.append(botRandom("botRandom"))

            if number == "14":
                players.append(botFaible("botFaible"))
                players.append(HumanPlayer("HumanPlayer"))
            if number == "15 ":
                players.append(botMinMax("botMinMax"))
                players.append(botFort("botFort"))

            if number == "16 ":
                players.append(botRandom("botRandom"))
                players.append(botFort("botFort"))

            if number == "17 ":
                players.append(HumanPlayer("HumanPlayer"))
                players.append(botFort("botFort"))

            if number == "18 ":
                players.append(botMinMax("botMinMax"))
                players.append(botRandom("botRandom"))

            if number == "19 ":
                players.append(botMinMax("botMinMax"))
                players.append(HumanPlayer("HumanPlayer"))

            if number == "20 ":
                players.append(botRandom("botRandom"))
                players.append(HumanPlayer("HumanPlayer"))

            if number =="21":
                players.append(botFort("botFort"))
                players.append(botRandom("botRandom"))
                players.append(BotCustomPlayer("BotCustomPlayer"))
                players.append(HumanPlayer("HumanPlayer"))
                players.append(botFaible("botFaible"))
                players.append(botEchantillon("botEchantillon"))
                players.append(botMinMax("botMinMax"))
            

            game=NimmtGame(players)
            scores, winners=game.play()

            print("La partie est terminée!")
            print("Scores finaux :")
            return scores.items(),winners
            return scores.items(),winners
        except ValueError:
            print("Veuillez entrer un nombre entier.")


def generate_plot(number, repetition):
    liste = []
    for _ in range(repetition):
        (score, winners) = interactiveRun(number)
        liste += score
    liste_m = moyenne(liste)
    sorted_liste_m = sorted(liste_m, key=lambda x: x[1])
    nom, m = zip(*sorted_liste_m)
    nameColor = []
    colors = ['yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'green', 'black']
    for i in range(len(nom)):
        nameColor.append(colors[i])
    plt.bar(nom, m, color=nameColor, align='edge')
    plt.xlabel('Bots')
    plt.ylabel("Average")

    img_bytesio = BytesIO()
    plt.savefig(img_bytesio, format='png')
    plt.close()
    img_bytesio.seek(0)
    return base64.b64encode(img_bytesio.getvalue()).decode('utf-8')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        number = request.form['number']
        repetition = int(request.form['repetition'])
        liste = []
        image = generate_plot(number, repetition)
        return render_template('index.html', image=image)
    return render_template('index.html', s=None)


def moyenne(liste):
    nb_par_nom={}
    for playername, score in liste :
        if playername in nb_par_nom:
            nb_par_nom[playername].append(score)
        else:
            nb_par_nom[playername]=[score]
    moyenne_par_nom = []
    for nom, points in nb_par_nom.items():
        moyenne_par_nom.append((nom, sum(points)/len(points)))
    return moyenne_par_nom


@app.route('/play', methods=['POST'])
def play_game():
    selected_number = int(request.form['selected_number'])
    # Code pour créer les joueurs en fonction du numéro sélectionné et lancer le jeu
    return "Le jeu a été lancé avec la combinaison de joueurs sélectionnée."


if __name__ == "__main__":
    app.run(debug=True)