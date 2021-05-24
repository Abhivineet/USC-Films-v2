const express = require('express');
const axios = require('axios');
const cors = require('cors');
const _ = require('lodash');
const app = express()
app.use(cors());
const port = 8080
const API_KEY = 'c7678dbba6272b0fd8397ddd755e6a3a'

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.get('/api/search/:query', (req,res) => {
    const query = req.params.query;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=enUS&query=${query}`;
    out = [];
    axios.get(url).then(response => {
        res_holder = response.data.results;
        let i = 0;
        while (i<res_holder.length){
            if (res_holder[i].media_type=='movie' || res_holder[i].media_type=='tv'){
                out.push({
                    'title': res_holder[i].media_type === 'tv' ? res_holder[i].name : res_holder[i].title,
                    'media': res_holder[i].media_type,
                    'id': res_holder[i].id,
                    'backdropPath': res_holder[i].backdrop_path!=null && res_holder[i].backdrop_path!='' ? 'https://image.tmdb.org/t/p/original' + res_holder[i].backdrop_path : 'https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW6/imgs/movie-placeholder.jpg'
                });
            }
            if (out.length === 7){
                break;
            }
            i++;
        }
        res.json(out);
    });
});

app.get('/api/cpmc', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`).then(response=>{
        results = response.data.results;
        output = [];
        let i=0;
        while(output.length<Math.min(5,results.length)){
            temp = {
                'media': 'movie',
                'title': results[i].title,
                'id': results[i].id,
                'backdropPath': results[i].backdrop_path!=null || results[i].backdrop_path!='' ? 'https://image.tmdb.org/t/p/original' + results[i].backdrop_path : ''
            }
            if(temp['backdropPath']!=''){
                output.push(temp)
            }
            i++;
        }
        res.json({'output': output});
        // res.send(output);
    });
});

app.get('/api/home_data', (req, res) => {
    const url1 = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    const url2 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    const url3 = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    const url4 = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
    const url5 = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    const url6 = `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`


    const request1 = axios.get(url1);
    const request2 = axios.get(url2);
    const request3 = axios.get(url3);
    const request4 = axios.get(url4);
    const request5 = axios.get(url5);
    const request6 = axios.get(url6);

    keys = ['Popular Movies', 'Top Rated Movies', 'Trending Movies', 'Popular TV Shows', 'Top Rated TV Shows', 'Trending TV Shows'];

    axios.all([request1, request2, request3, request4, request5, request6]).then(axios.spread((...responses) => {
        let out = {};
        for (let i =0; i<Math.min(20,responses.length); i++){
            output = []
            for(let j=0; j<responses[i].data.results.length;j++){
                temp = {
                    'media': i==3 || i==4 || i==5 ? 'tv' : 'movie',
                    'title': i==3 || i==4 || i==5 ? responses[i].data.results[j].name : responses[i].data.results[j].title,
                    'id': responses[i].data.results[j].id,
                    'posterPath': responses[i].data.results[j].poster_path!=null && responses[i].data.results[j].poster_path!='' ? 'https://image.tmdb.org/t/p/w500' + responses[i].data.results[j].poster_path : 'https://cinemaone.net/images/movie_placeholder.png'
                };
                output.push(temp);
            }
            out[keys[i]] = output;
        }
        res.json(out);
    }));

});

app.get('/api/details/person/:id', (req, res) => {
    const id = req.params.id;

    const url1 = `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US&page=1`;

    const url2 = `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${API_KEY}&language=en-US&page=1`

    const request1 = axios.get(url1);
    const request2 = axios.get(url2);

    axios.all([request1, request2]).then(axios.spread((...responses)=>{
        let out = {}
        for (let i=0; i<responses.length; i++ ){
            res_holder = responses[i].data;
            if (i==0){
                if (res_holder['birthday'] != null && res_holder['birthday'].length>0){
                    out['birthday'] = res_holder['birthday'];
                }
                if (res_holder['gender'] != null && res_holder['gender']!='0'){
                    out['gender'] = res_holder['gender']==1 ? 'Female' : 'Male';
                }
                out['name'] = res_holder['name'];
                if (res_holder['homepage']!=null && res_holder['homepage'].length>1 && res_holder['homepage'].includes('http')){
                    out['homepage'] = res_holder['homepage'];
                }
                let aka_str = '';
                for (let n of res_holder['also_known_as']){
                    aka_str = aka_str + n + ',';
                }
                if (aka_str!=''){
                    aka_str = aka_str.slice(0,-1);
                    out['aka'] = aka_str;
                }
                if (res_holder['known_for_department']!=null && res_holder['known_for_department'].length>0){
                    out['known_for'] = res_holder['known_for_department'];
                }
                if (res_holder['biography'] != null && res_holder['biography'].length>0){
                    out['biography'] = res_holder['biography'];
                }
                if(res_holder['place_of_birth']!=null && res_holder['place_of_birth'].length>0){
                    out['birthplace'] = res_holder['place_of_birth'];
                }
            }
            else{
                if (res_holder['imdb_id']!=null && res_holder['imdb_id'].length>0){
                    out['imdb_link'] = 'https://www.imdb.com/name/' + res_holder['imdb_id'];
                }
                if (res_holder['facebook_id']!=null && res_holder['facebook_id'].length>0){
                    out['facebook_link'] = 'https://www.facebook.com/' + res_holder['facebook_id'];
                }
                if (res_holder['instagram_id']!=null && res_holder['instagram_id'].length>0){
                    out['instagram_link'] = 'https://www.instagram.com/' + res_holder['instagram_id'];
                }
                if (res_holder['twitter_id']!=null && res_holder['twitter_id'].length>0){
                    out['twitter_link'] = 'https://twitter.com/' + res_holder['twitter_id'];
                }
            }
        }
        res.json(out);
    }));
});


app.get('/api/details/:media/:id', (req, res) => {
    
    const media = req.params.media;
    const id = req.params.id;

    const url1 = `https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${API_KEY}&language=en-US&page=1`;
    const url2 = `https://api.themoviedb.org/3/${media}/${id}?api_key=${API_KEY}&language=en-US&page=1`;
    const url3 = `https://api.themoviedb.org/3/${media}/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`;
    const url4 = `https://api.themoviedb.org/3/${media}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`;
    const url5 =  `https://api.themoviedb.org/3/${media}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
    const url6 =  `https://api.themoviedb.org/3/${media}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`;
    
    const request1 = axios.get(url1);
    const request2 = axios.get(url2);
    const request3 = axios.get(url3);
    const request4 = axios.get(url4);
    const request5 = axios.get(url5);
    const request6 = axios.get(url6);

    keys = ['video', 'details', 'reviews', 'cast', 'recommended', 'similar'];
    axios.all([request1, request2, request3, request4, request5, request6]).then(axios.spread((...responses)=>{
        let out = {}
        for(let i=0; i<responses.length; i++){
            res_holder = responses[i]['data']
            temp = {}
            if (i==0){
                info_holder = {'Trailer': [], 'Teaser': []};
                for (let i=0; i<res_holder['results'].length; i++){
                    if (res_holder['results'][i]['type'] === 'Trailer'){
                        info_holder.Trailer.push(i);
                    }
                    else if (res_holder['results'][i]['type'] === 'Teaser'){
                        info_holder.Teaser.push(i);
                    }
                }
                if (info_holder.Trailer.length > 0){
                    temp['key'] = res_holder['results'][info_holder.Trailer[0]]['key'];
                }
                else if (info_holder.Teaser.length > 0){
                    temp['key'] = res_holder['results'][info_holder.Teaser[0]]['key'];
                }
                else{
                    temp['key'] = 'tzkWB85ULJY';
                }
            }
            else if (i==1){
                out['media'] = media;
                temp['title'] = media=='movie' ? res_holder['title'] : res_holder['name'];
                out['posterPath'] = res_holder.poster_path!=null && res_holder.poster_path!='' ? 'https://image.tmdb.org/t/p/w500' + res_holder.poster_path : 'https://cinemaone.net/images/movie_placeholder.png';
                temp['tagline'] = res_holder['tagline'];
                temp['vote_average'] = res_holder['vote_average'];
                temp['overview'] = res_holder['overview'];
                if (res_holder['genres'].length > 0){
                    let genre_string = '';
                    for (let genre of res_holder['genres']){
                        genre_string = genre_string + genre['name'] + ', ';
                    }
                    temp['genres'] = genre_string.slice(0,-2);
                }
                if (res_holder['spoken_languages'].length > 0){
                    let spl = '';
                    for (let lang of res_holder['spoken_languages']){
                        spl = spl + lang['english_name'] + ', '
                    }
                    temp['spoken_languages'] = spl.slice(0,-2);
                }
                if (media==='movie'){
                    temp['year'] = res_holder['release_date'].slice(0,-6);
                    temp['runtime'] = res_holder['runtime'];
                }
                else{
                    temp['year'] = res_holder['first_air_date'].slice(0,-6);
                    temp['runtime'] = res_holder['episode_run_time'].length>0 ? res_holder['episode_run_time'][0] : res_holder['episode_run_time'];
                }

                let h = Math.floor(+temp['runtime']/60);
                let m = (+temp['runtime'])%60;
                temp['runtime'] = h>0 ? h + 'hr ' + m + 'min' : m + 'min';
            }
            else if (i==2){
                temp2 = [];
                val = Math.min(10, +res_holder['total_results']);
                for (let i=0; i<val; i++){
                    d1 = new Date(res_holder['results'][i]['created_at']);
                    d2 = new Date(res_holder['results'][i]['created_at']);
                    date = formatDate(d1) + ', ' + formatAMPM(d2);
                    rev = {
                        'author': res_holder['results'][i]['author'],
                        'content': res_holder['results'][i]['content'],
                        'created_at': date,
                        'url': res_holder['results'][i]['url'],
                        'rating': res_holder['results'][i]['author_details']['rating']!=null ? res_holder['results'][i]['author_details']['rating'] : 0,
                        'avatar_path': res_holder['results'][i]['author_details']['avatar_path']
                    };
                    if (rev.rating == null || rev.rating === 'null' || rev.rating.length === 0){
                        rev.rating = '0';
                    }
                    
                    if (rev.avatar_path == null || rev.avatar_path.length === 0 || rev.avatar_path === 'null'){
                        rev.avatar_path = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU`;
                    }
                    else{
                        checker = rev.avatar_path.includes('http');
                        if(!checker){
                            rev.avatar_path = `https://image.tmdb.org/t/p/original${rev.avatar_path}`;
                        }
                        else{
                            rev.avatar_path = rev.avatar_path.slice(1, rev.avatar_path.length);
                        }
                    }
                    temp2.push(rev);
                }
                temp = temp2;
            }
            else if (i==3){
                res_holder = res_holder['cast'];
                temp2 = [];
                for (let i=0; i<res_holder.length; i++){
                    cas = {
                        'id' : res_holder[i]['id'],
                        'name' : res_holder[i]['name'],
                        'character' : res_holder[i]['character'].length>0 ? res_holder[i]['character'] : 'Unknown',
                        'profile_path' : res_holder[i]['profile_path'],
                    };
                    if (cas['profile_path'] != '' && cas['profile_path']!=null && cas['profile_path']!=='null'){
                        cas['profile_path'] =  `https://image.tmdb.org/t/p/w500/${cas['profile_path']}`
                        temp2.push(cas);
                    }
                }
                temp = temp2;
            }
            else{
                temp2 = [];
                res_holder = res_holder['results'];
                for (let i=0; i<Math.min(20, res_holder.length); i++){
                    t = {
                        'title': media=='tv' ? res_holder[i].name : res_holder[i].title,
                        'media': media,
                        'id': res_holder[i].id,
                        'posterPath': res_holder[i].poster_path!=null && res_holder[i].poster_path!='' ? 'https://image.tmdb.org/t/p/w500' + res_holder[i].poster_path : 'https://cinemaone.net/images/movie_placeholder.png'
                    };
                    temp2.push(t);
                }
                temp = temp2;
            }
            out[keys[i]] = temp;
        }
        out['twitter'] = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(`Watch ${out['details']['title']} \n`) + '&url=' + encodeURIComponent(`https://www.youtube.com/watch?v=${out['video']['key']} \n`) + '&hashtags=' + encodeURIComponent('USC,CSCI571,FightOn');
        out['facebook'] = `https://www.facebook.com/sharer/sharer.php?u=https://www.youtube.com/watch?v=${out['video']['key']}`;
        res.json(out);
    }));
    
});

// function chunkify(a) {
//     out = []
//     count = 0
//     chunk = 0
//     while (count<20 && chunk<4){
//         c = []
//         if (chunk==3){
//             for (let i=count; i<count+2; i++){
//                 c.push(a[i]);
//             }
//             count = count + 2;
//         }
//         else{
//             for(let i=count; i<count+6; i++){
//                 c.push(a[i]);
//             }
//             count = count + 6;
//         }
//         out.push(c);
//         chunk++;
//     }
//     return out;
// }

function formatDate(date){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    year = date.getFullYear();
    month = months[date.getMonth()];
    d = date.getDate();
    let strDate = month + ' ' + d + ', ' + year;
    return strDate;

}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let mil = date.getSeconds();
    final_mil = +mil<10 ? '0' + mil : mil;
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    hours = hours<10 ? '0'+hours : hours;
    let strTime = hours + ':' + minutes + ':' + final_mil + ' ' + ampm;
    return strTime;
  }

app.listen(port, () => console.log(`Listening on ${port}....`));