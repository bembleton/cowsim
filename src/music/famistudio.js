export const fromText = (text) => {
  const project = {
    instruments: {},
    songs: [],
    arpeggios: {}
  };
  const lines = text.split('\n');
  let instrument;
  let song;
  let channel;
  let pattern;

  for (let line of lines) {
    const [type, params] = parseLine(line);
    switch (type) {
      case 'project':
        Object.assign(project, params);
        break;
      case 'instrument':
        instrument = {
          ...params,
          envelopes: []
        }
        project.instruments[params.name] = instrument;
        break;
      case 'envelope':
        parseValues(params);
        instrument.envelopes.push(params);
        break;
      case 'arpeggio':
        parseValues(params);
        project.arpeggios[params.name] = params;
        break;
      case 'song':
        song = {
          ...params,
          patternCustomSettings: [],
          channels: []
        };
        project.songs.push(song);
        break;
      case 'patternCustomSettings':
        song.patternCustomSettings[params.time] = params;
        break;
      case 'channel':
        channel = {
          type: params.type,
          patterns: {},
          patternInstances: []
        };
        song.channels.push(channel);
        break;
      case 'pattern':
        pattern = {
          name: params.name,
          notes: []
        };
        channel.patterns[params.name] = pattern;
        break;
      case 'note':
        pattern.notes[params.time] = params;
        break;
      case 'patternInstance':
        channel.patternInstances[params.time] = params.pattern;
        break;
    }
  }

  return project;
};

const parseLine = (line) => {
  line = line.trimStart();
  const sep = line.indexOf(" ");
  const type = sep > 0 ? line.substring(0, sep) : line;
  const params = sep > 0 ? line.substring(sep+1) : "";
  const result = {};
  // allow escaped double quotes: "John ""Pizza"" Doe"
  const paramsRe = /\s*([^=]+)="(([^"]|"{2})+)"/g;
  let m;
  do {
    m = paramsRe.exec(params);
    if (m) {
      // unescape quotes
      result[toCamelCase(m[1])] = coerce(m[2].replace(`""`, `"`));
    }
  }
  while(m);
  return [toCamelCase(type), result];
};

const coerce = (value) => {
  if (isNaN(value)) return value;
  return Number(value);
};

const parseValues = (params) => {
  if (/,/.test(params.values)) {
    params.values = params.values.split(',').map(coerce);
  } else if (params.values) {
    params.values = [params.values];
  }
};

const toCamelCase = (str) => {
  return str.replace(/^./, (s) => s.toLowerCase());
};
