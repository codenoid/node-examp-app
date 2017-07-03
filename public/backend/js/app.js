$('[panel-info]').each(function(){
	$(this).click(function(){
		var d = $(this).attr('panel-info')
		$('div[panel-info!="'+d+'"] .panel').removeClass('active')
		$('div[panel-info="'+d+'"] .panel').addClass('active')
		$('table[table-for!="'+d+'"]').addClass('hidden')
		$('table[table-for="'+d+'"]').removeClass('hidden')
		$('.panel-heading').html(d.charAt(0).toUpperCase() + d.slice(1))
	})
})