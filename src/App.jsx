import axios from 'axios';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const renderPosts = (posts) => {
  return posts.map((post) => {
    return (
      <div key={post.id} style={{ display: 'flex', justifyContent: 'center' }}>
        <a href={post.file_url} target="_blank">
          <LazyLoadImage
            alt={post.tags}
            placeholderSrc={`https://via.placeholder.com/${post.sample_width}x${post.sample_height}?text=${post.tags}`}
            src={post.jpeg_url} // use normal <img> attributes as props
            height={post.sample_height}
            width={post.sample_width}
            effect="blur"
          />
        </a>
      </div>
    );
  });
};

async function fetchData(setPosts, tag, page = 1) {
  const { data } = await axios.get(
    `https://yande.re/post.json?tags=${tag}&page=${page}`
  );
  setPosts(data);
}

const App = () => {
  const [posts, setPosts] = React.useState([]);
  const [tags, setTags] = React.useState('');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    fetchData(setPosts, tags, page);
  }, [page]);

  const handleClickSearch = () => {
    fetchData(setPosts, tags, page);
    //Go to the top of the page
    window.scrollTo(0, 0);
    setPosts([]);
  };

  const handleChangePage = (inc) => {
    if (inc) {
      setPage(page + 1);
    } else if (page > 1) {
      setPage(page - 1);
    }
    window.scrollTo(0, 0);
    setPosts([]);
  };

  return (
    <div>
      <div style={{ position: 'fixed', zIndex: 10 }}>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          type="text"
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleClickSearch();
          }}
        ></input>
        <button onClick={() => handleClickSearch()}>Find</button>
      </div>
      <div style={{ position: 'fixed', zIndex: 9, right: 20, bottom: 20 }}>
        <button onClick={() => handleChangePage(false)}>Previous</button>
        <span>{page}</span>
        <button onClick={() => handleChangePage(true)}>Next</button>
      </div>
      {renderPosts(posts)}
    </div>
  );
};

export default App;
