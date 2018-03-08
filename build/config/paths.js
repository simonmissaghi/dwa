const paths = {
  get(task, config = null) {
    this.config = config || {
      scripts: {
        files: ['main'],
        folders: [
          'components',
          'utils',
          'vendor',
        ],
      },
    };

    this.init();

    if (!this[task]) {
      throw new Error(`Task '${task}' does not exist!`);
    }

    return this[task]();
  },

  init() {
    // Basic paths
    this.src = 'src'; // (src)
    this.root = 'dist'; // (dist)
    this.tmp = '.tmp';
    this.dist = this.root; // (dist)
    this.dest = this.dist; // (dist)
    this.assets = 'assets';

    // Scripts related paths
    this.jsFiles = [this.config.scripts.files.reduce((acc, cur) => {
      acc[`assets/scripts/${cur}`] = `./${this.src}/assets/scripts/${cur}.js`;

      return acc;
    }, {})];
    this.jsFolders = this.config.scripts.folders;

    // Files & clean paths
    this.filesPaths = [
      `!${this.src}/${this.assets}/images{,/**}`,
      `!${this.src}/${this.assets}/media{,/**}`,
      `!${this.src}/${this.assets}/styles{,/**}`,
      `!${this.src}/${this.assets}/scripts/*`,
      `!${this.src}/${this.assets}/svg{,/**}`,
    ];
    this.cleanPaths = [
      `${this.dest}/.*`,
      `!${this.dest}/.gitkeep`,
      `${this.tmp}/*`,
    ];
    this.filesPaths.unshift(`${this.src}/**/*`);
    this.filesPaths.unshift(`${this.src}/**/.*`);
    this.cleanPaths.unshift(`${this.dest}/*`);

    this.jsFolders.forEach(folder => {
      this.filesPaths = this.filesPaths.concat(
        this.getMultiPaths(`!${this.src}`, `scripts/${folder}{,/**}`)
      );
    });

    // Manifest paths
    this.manifestPaths = ['rev-manifest.json'];
  },

  getMultiPaths(before = null, after = null, assets = true) {
    const pre = before ? `${before}/` : '';
    const post = after ? `/${after}` : '';
    const mid = assets ? this.assets : '';

    return [`${pre}${mid}${post}`];
  },

  // Tasks paths
  clean() {
    return {
      dist: this.cleanPaths,
    };
  },
  breakpoints() {
    return {
      src: 'build/inc/breakpoints.json',
      dest: {
        styles: this.getMultiPaths(this.src, 'styles/utils/'),
        scripts: this.getMultiPaths(this.src, 'scripts/utils/'),
      },
      file: 'breakpoints.json',
    };
  },
  copy() {
    return {
      src: this.filesPaths,
      base: this.src,
      dest: this.dest,
    };
  },
  images() {
    return {
      src: `${this.src}/${this.assets}/images/**/*`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  media() {
    return {
      src: `${this.src}/${this.assets}/media/**/*`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  svg() {
    return {
      src: this.getMultiPaths(this.src, 'svg/**/*.svg'),
      base: this.getMultiPaths(this.src, 'svg'),
      dest: this.getMultiPaths(this.dest, 'svg'),
      tmp: this.getMultiPaths(this.tmp, 'svg'),
    };
  },
  styles() {
    return {
      src: `${this.src}/${this.assets}/styles/*.scss`,
      base: this.src,
      dest: this.dest,
      tmp: this.tmp,
    };
  },
  scripts() {
    return {
      entries: {
        task: this.jsFiles,
        bundle: this.jsFiles.reduce((acc, cur) => Object.assign(acc, cur), {}),
      },
      dest: this.getMultiPaths(this.dest, 'scripts'),
      tmp: this.getMultiPaths(this.tmp, 'scripts'),
      opts: this.getMultiPaths(this.src, 'scripts')
        .concat(this.getMultiPaths(this.src, 'styles/utils/')),
      include: this.config.scripts.include || [],
      public: this.root.replace(/^\//, ''),
    };
  },
  rev() {
    return {
      src: this.manifestPaths.map((path, i) => [
        this.getMultiPaths(this.tmp, 'styles/*.min.css')[i],
        this.getMultiPaths(this.tmp, 'styles/*.min.css.map')[i],
        this.getMultiPaths(this.tmp, 'scripts/*.min.js')[i],
        this.getMultiPaths(this.tmp, 'scripts/*.min.js.map')[i],
        this.getMultiPaths(this.tmp, 'images/**/*')[i],
        this.getMultiPaths(this.tmp, 'media/**/*')[i],
        this.getMultiPaths(this.tmp, 'svg/**/*')[i],
      ]),
      base: this.getMultiPaths(this.tmp),
      dest: this.getMultiPaths(this.dest),
      manifest: {
        files: this.manifestPaths,
        src: this.manifestPaths,
        dest: process.cwd(),
      },
      replace: this.manifestPaths.map((path, i) => [
        this.getMultiPaths(this.dest, 'styles/*.css')[i],
        this.getMultiPaths(this.dest, 'scripts/*.js')[i],
        this.getMultiPaths(this.dest, '**/*.+(html|php|twig|jade|info)', false)[i],
      ]),
      extensions: [
        '.js',
        '.css',
        '.html',
        '.php',
        '.twig',
        '.jade',
        '.info',
      ],
    };
  },
  zip() {
    return {
      src: [`${this.root}/**/*`, `${this.root}/**/.*`],
      dest: this.root,
      file: 'dist.zip',
    };
  },
  watch() {
    return {
      dist: this.dist,
      src: this.src,
      dest: this.dest,
      copy: this.filesPaths,
      styles: `${this.src}/${this.assets}/styles/**/*.scss`,
      scripts: this.dest.replace(new RegExp(`^${this.root}`), ''), // Strip root folder
      images: `${this.src}/${this.assets}/images/**/*`,
      media: `${this.src}/${this.assets}/media/**/*`,
      svg: `${this.src}/${this.assets}/svg/**/*`,
    };
  },
};

module.exports = paths;
