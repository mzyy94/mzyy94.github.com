---
layout: null
---
$(document).ready(function() {
	// Calendar loader
	var posts = {};
	var datelist = [];
	$.getJSON('/blog/posts.json', function(data){
		var dp = data.posts;
		for(var i = 0, limit = dp.length; i < limit; i++){
			var date = new Date(dp[i].date);
			posts[dp[i].date] = {title:dp[i].title,
				url: '/blog/' + date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + dp[i].url + '/'}
			datelist.push(dp[i].date);
		}
		assignCalendar('#date_departure');
		refreshDate();
	});

	function assignCalendar(id){
		$('<div class="calendar" />')
			.insertAfter( $(id) )
			.datepicker({
				beforeShowDay: function(date){
					var string = $.datepicker.formatDate('dd M yy', date);
					return [ datelist.indexOf(string) != -1 ]
				},
				dateFormat: 'dd M yy',
				minDate: new Date(datelist[datelist.length - 1]),
				maxDate: new Date(),
				maxPicks: 1,
				altField: id,
				firstDay: 0,
				showOtherMonths: true,
				onSelect: function(date){
					window.location.href = posts[date].url;
				},
				onChangeMonthYear: refreshDate
			}).prev().hide();
	}

	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	function refreshDate(){
		setTimeout(function(){
			$('a.ui-state-default').each(function(num){
				var yy = $(this).parent().attr('data-year');
				var M = month[$(this).parent().attr('data-month')];
				var dd = ('0' + $(this).text()).slice(-2);
				var idx = dd + ' ' + M + ' ' + yy;
				$(this).attr('data-title', posts[idx].title);
				$(this).attr('href', posts[idx].url);
			});
		},10);
	}


	// Repository loader
	if (!window.jXHR){
		var jxhr = document.createElement('script');
		jxhr.type = 'text/javascript';
		jxhr.src = '{{ root_url}}/assets/javascripts/libs/jXHR.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(jxhr, s);
	}

	github.showRepos({
		user: '{{site.github_user}}',
		count: {{site.github_repo_count}},
		skip_forks: {{site.github_skip_forks}},
		target: '#gh_repos'
	});


	// Link target setter
	$("a[href^='http'], a[href^='ftp']").click(function () {
		if ($(this).attr("target") === undefined)
		$(this).attr("target", "_blank");
	});

});
