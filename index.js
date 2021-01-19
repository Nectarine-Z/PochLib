var booksArray = [];
var maxHeight = 0;

const formulaire = `<form id="form"> 
					<h4>Titre du livre</h4>
					<input type="text" name="titre du livre" id= "livre"  placeholder="Saisir le titre du livre" required="saisie obligatoire">
					<h4>Auteur</h4>
					<input type="text" name="nom de l'auteur" id= "auteur"	placeholder="Saisir le nom de l'auteur.e" required="saisie obligatoire">
					<button id="go">Rechercher</button>
					<button id="cancel">Annuler</button>
					</form>`

function afficherNouveauFavori(id)
{
	$.getJSON("https://www.googleapis.com/books/v1/volumes/" + id, function(result)
	{
		description = typeof result.volumeInfo.description !== 'undefined' ? result.volumeInfo.description.substring(0,201) : "Information manquante";
		lienImage = typeof result.volumeInfo.imageLinks !== 'undefined' ? (typeof result.volumeInfo.imageLinks.smallThumbnail !== 'undefined' ? result.volumeInfo.imageLinks.smallThumbnail : "./unavailable.png") : "./unavailable.png";
		$('#content').append(getBookCards(result.volumeInfo.title, result.id, result.volumeInfo.authors[0], description, lienImage, 0));
	});
}

$(document).ready(function()
{
	var stringifiedArray = sessionStorage.getItem("books");
	if(stringifiedArray != null)
	{
		booksArray = JSON.parse(stringifiedArray);
		booksArray.forEach(function(id)
		{
			afficherNouveauFavori(id);
		});
	}

	$("#containerBoutonAjout").click(function()
	{
		$("#containerBoutonAjout").after(formulaire);
		$("#containerBoutonAjout").empty();
		
		$("#cancel").click(function()
		{
			$("#form").remove();
			$('#resultContainer').empty();
			$('#resultLabel').remove();
			$("#containerBoutonAjout").append($("<button>Ajouter un livre</button>").attr("id", "boutonAjout"));

		});

		$("#go").click(function(e)
		{
			e.preventDefault();
			const titleRequest = $("#livre").val();
			const authorRequest = $("#auteur").val();

			if(titleRequest == "" || authorRequest == "")
			{
				alert ("Au moins un champ est vide !");
				return;
			}

			$.getJSON("https://www.googleapis.com/books/v1/volumes?q=intitle:" + titleRequest + "+inauthor:" + authorRequest, function(result)
			{
				
				$('#resultContainer').empty();
				$('#resultContainer').before('<h3 id="resultLabel"> Résultat de la recherche</h3>');
				
				if(result.totalItems == 0)
				{
					alert ("Aucun livre n'a été trouvé !");
					return;
				}
				result.items.forEach(function(item)
				{
					description = typeof item.volumeInfo.description !== 'undefined' ? item.volumeInfo.description.substring(0,201) : "Information manquante";
					lienImage = typeof item.volumeInfo.imageLinks !== 'undefined' ? (typeof item.volumeInfo.imageLinks.smallThumbnail !== 'undefined' ? item.volumeInfo.imageLinks.smallThumbnail : "./unavailable.png") : "./unavailable.png";
					$('#resultContainer').append(getBookCards(item.volumeInfo.title, item.id, item.volumeInfo.authors[0], description, lienImage));
				});
			});
			
		});
	});
});

function getBookCards(_title, _id, _author, _description, _imgLink, type = 1)
{
	const icon = $('<i></i>').addClass('icon');
	if(type == 0)
	{
		icon.addClass('fa fa-trash fa-2x');
		icon.click(function()
		{
			booksArray.pop(_id)
			$('#' + _id + "Fav").remove();
			sessionStorage.setItem("books", JSON.stringify(booksArray));
		});
	}
				else if(type == 1)
	{
		icon.addClass('fa fa-bookmark fa-2x');
		icon.click(function()
		{
			if(!booksArray.includes(_id))
			{
				booksArray.push(_id);			
				sessionStorage.setItem("books", JSON.stringify(booksArray));
				afficherNouveauFavori(_id);
			}
			else
				alert("Vous ne pouvez pas ajouter deux fois le même livre !")
		})
	}

	card = $('<article></article>').addClass('card').attr('id', _id + (type == 0 ? "Fav" : "Res"));
	card.append(icon);
	card.append($('<h1></h1>').addClass('cardTitle').text("Titre : " + _title));
	card.append($('<h2></<h2>').addClass('cardId').text("ID : " + _id));
	card.append($('<h2></<h2>').addClass('cardAuthor').text("Auteur : " + _author));
	card.append($('<p></<p>').addClass('cardDescription').text("Description : " + _description));
	card.append($('<img></<img>').addClass('cardImage').attr({'src' : _imgLink, width : '100%'}).text("Description : " + _description));
	return card;
}

