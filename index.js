

$(document).ready(function()
{
	$(".h3").click(function()
	{
		const formulaire = `<div id="form">
					<input type="text" name="titre du livre" id= "livre"  placeholder="Saisir le titre du livre" required="saisie obligatoire">
					<input type="text" name="nom de l'auteur" id= "auteur"	placeholder="Saisir le nom de l'auteur.e" required="saisie obligatoire">
					<input type="button" name="Rechercher" id="go" value="Rechercher">
					</div>`
		$(".h3").after(formulaire)

		$("#go").click(function(){
			const titleRequest = $("#livre").val();
			const authorRequest = $("#auteur").val();

			if(titleRequest == "" || authorRequest == "")
			{
				alert ("Au moins un champ est vide");
				return;
			}

			$.getJSON("https://www.googleapis.com/books/v1/volumes?q=intitle:" + titleRequest + "+inauthor:" + authorRequest, function(result)
			{
				$('#resultContainer').empty();
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

function getBookCards(_title, _id, _author, _description, _imgLink)
{
	card = $('<div></div>').addClass('card');
	card.append($('<i></i>').addClass('fa fa-bookmark'));
	card.append($('<h1></h1>').addClass('cardTitle').text("Titre : " + _title));
	card.append($('<h2></<h2>').addClass('cardId').text("ID : " + _id));
	card.append($('<h2></<h2>').addClass('cardAuthor').text("Auteur : " + _author));
	card.append($('<p></<p>').addClass('cardDescription').text("Description : " + _description));
	card.append($('<img></<img>').addClass('cardImage').attr({'src' : _imgLink, width : '100%'}).text("Description : " + _description));
	return card;
}