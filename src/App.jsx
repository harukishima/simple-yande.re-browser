import axios from 'axios';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const renderPosts = (posts) => {
  return posts.map((post) => {
    return (
      <div key={post.id} style={{ display: 'flex', justifyContent: 'center' }}>
        <LazyLoadImage
          alt={post.tags}
          src={post.jpeg_url} // use normal <img> attributes as props
          //width="90%"
          //width={1000}
          height={post.sample_height}
          effect="blur"
        />
        <a href={post.file_url} target="_blank">
          full size
        </a>
      </div>
      // <img
      //   style={{ display: 'flex', justifyContent: 'center' }}
      //   src={post.file_url}
      //   alt={post.tags}
      //   key={post.id}
      //   width="90%"
      // ></img>
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
  return (
    <div>
      <div style={{ position: 'fixed', zIndex: 10 }}>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          type="text"
          onKeyPress={(e) => {
            if (e.key === 'Enter') fetchData(setPosts, tags, page);
          }}
        ></input>
        <button onClick={() => fetchData(setPosts, tags, page)}>Find</button>
      </div>
      <div style={{ position: 'fixed', zIndex: 9, right: 20, bottom: 20 }}>
        <button
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          Previous
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {renderPosts(posts)}
    </div>
  );
};

export default App;
